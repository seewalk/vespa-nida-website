'use client';

import { useState, useRef, useCallback } from 'react';
import { storage, db, auth } from '../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGE_CATEGORIES = [
  { id: 'front', label: 'Priekis', icon: '🔵' },
  { id: 'back', label: 'Galas', icon: '🔴' },
  { id: 'left', label: 'Kairė', icon: '🟡' },
  { id: 'right', label: 'Dešinė', icon: '🟢' },
  { id: 'dashboard', label: 'Skydelis', icon: '📊' },
  { id: 'seat', label: 'Sėdynė', icon: '🪑' },
  { id: 'damage', label: 'Pažeidimai', icon: '⚠️' },
  { id: 'general', label: 'Bendras', icon: '📷' }
];

function ScooterImageUpload({ 
  booking, 
  imageType, // 'before' or 'after'
  onImagesUpdate,
  onClose 
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('front');
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Debug: Log component initialization
  console.log('🚀 ScooterImageUpload initialized:', {
    bookingId: booking?.id,
    imageType,
    selectedCategory,
    auth: auth?.currentUser?.email
  });

  // Add notification with debug logging
  const addNotification = (message, type = 'success') => {
    const id = Date.now();
    const notification = { id, message, type, timestamp: new Date().toISOString() };
    
    console.log(`📢 Notification [${type.toUpperCase()}]:`, {
      message,
      type,
      timestamp: notification.timestamp
    });
    
    setNotifications(prev => [...prev, notification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000); // Increased to 5 seconds for better visibility
  };

  // Compress image before upload with debug logging
  const compressImage = (file, maxWidth = 1920, quality = 0.8) => {
    console.log('🗜️ Starting image compression:', {
      fileName: file.name,
      originalSize: file.size,
      type: file.type,
      maxWidth,
      quality
    });

    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        console.log('🖼️ Image compression details:', {
          originalDimensions: `${img.width}x${img.height}`,
          newDimensions: `${canvas.width}x${canvas.height}`,
          compressionRatio: ratio
        });
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            console.log('✅ Image compression completed:', {
              originalSize: file.size,
              compressedSize: blob.size,
              compressionSavings: `${Math.round((1 - blob.size / file.size) * 100)}%`
            });
            resolve(blob);
          } else {
            console.error('❌ Image compression failed: blob is null');
            reject(new Error('Image compression failed'));
          }
        }, 'image/jpeg', quality);
      };
      
      img.onerror = (error) => {
        console.error('❌ Image load error during compression:', error);
        reject(new Error('Failed to load image for compression'));
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Upload single image to Firebase Storage with detailed debug logging
  const uploadImage = async (file, category) => {
    const timestamp = Date.now();
    const fileName = `${imageType}_${category}_${timestamp}.jpg`;
    const storagePath = `bookings/${booking.id}/${imageType}/${fileName}`;
    
    console.log('📤 Starting image upload:', {
      fileName,
      storagePath,
      category,
      fileSize: file.size,
      fileType: file.type,
      bookingId: booking.id,
      imageType,
      userEmail: auth?.currentUser?.email
    });

    try {
      // Compress image
      console.log('🗜️ Compressing image...');
      const compressedFile = await compressImage(file);
      console.log('✅ Image compression successful');

      // Create storage reference
      console.log('📍 Creating storage reference...');
      const storageRef = ref(storage, storagePath);
      console.log('✅ Storage reference created:', { path: storagePath });

      // Create upload task
      console.log('⬆️ Starting upload task...');
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`📊 Upload progress for ${fileName}: ${Math.round(progress)}%`);
            setUploadProgress(prev => ({ ...prev, [fileName]: progress }));
          },
          (error) => {
            console.error('❌ Upload error:', {
              fileName,
              error: error.message,
              code: error.code,
              serverResponse: error.serverResponse
            });
            addNotification(`Klaida įkeliant ${fileName}: ${error.message}`, 'error');
            reject(error);
          },
          async () => {
            try {
              console.log('⬇️ Getting download URL...');
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              const imageMetadata = {
                id: `${timestamp}_${category}`,
                fileName,
                storagePath,
                downloadURL,
                category,
                uploadedAt: new Date(),
                uploadedBy: auth.currentUser?.email || 'unknown'
              };
              
              console.log('✅ Upload completed successfully:', {
                fileName,
                downloadURL,
                metadata: imageMetadata
              });
              
              resolve(imageMetadata);
            } catch (error) {
              console.error('❌ Error getting download URL:', error);
              addNotification(`Klaida gaunant nuoroda ${fileName}`, 'error');
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('❌ Upload preparation error:', error);
      addNotification(`Klaida ruošiant įkėlimą: ${error.message}`, 'error');
      throw error;
    }
  };

  // Update Firestore with image metadata with debug logging
  const updateFirestoreImages = async (newImages) => {
    console.log('💾 Starting Firestore update:', {
      bookingId: booking.id,
      imageType,
      newImagesCount: newImages.length,
      newImages: newImages.map(img => ({ id: img.id, category: img.category, fileName: img.fileName }))
    });

    try {
      const bookingRef = doc(db, 'bookings', booking.id);
      
      // Get existing images
      const existingImages = booking.images?.[imageType]?.images || [];
      console.log('📋 Existing images:', {
        count: existingImages.length,
        images: existingImages.map(img => ({ id: img.id, category: img.category }))
      });
      
      const updatedImages = [...existingImages, ...newImages];
      
      const updateData = {
        [`images.${imageType}`]: {
          uploaded: updatedImages.length > 0,
          uploadedAt: new Date(),
          uploadedBy: auth.currentUser?.email || 'unknown',
          images: updatedImages
        },
        'metadata.updatedAt': new Date()
      };

      console.log('📝 Firestore update data:', {
        path: `images.${imageType}`,
        totalImages: updatedImages.length,
        updateData
      });

      await updateDoc(bookingRef, updateData);
      console.log('✅ Firestore update successful');
      
      // Trigger parent component update
      if (onImagesUpdate) {
        console.log('🔄 Triggering parent component update...');
        onImagesUpdate({
          ...booking,
          images: {
            ...booking.images,
            [imageType]: updateData[`images.${imageType}`]
          }
        });
        console.log('✅ Parent component update triggered');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Firestore update error:', {
        error: error.message,
        code: error.code,
        bookingId: booking.id,
        imageType
      });
      addNotification(`Klaida išsaugant duomenis: ${error.message}`, 'error');
      throw error;
    }
  };

  // Handle file upload with enhanced debug logging
  const handleFileUpload = async (files) => {
    console.log('📂 File upload initiated:', {
      filesCount: files?.length || 0,
      selectedCategory,
      files: files ? Array.from(files).map(f => ({ name: f.name, size: f.size, type: f.type })) : []
    });

    if (!files || files.length === 0) {
      console.log('⚠️ No files provided for upload');
      addNotification('Nepasirinkti failai', 'error');
      return;
    }
    
    setUploading(true);
    const uploadPromises = [];
    let validImageCount = 0;
    
    try {
      for (const file of files) {
        console.log('🔍 Processing file:', { name: file.name, type: file.type, size: file.size });
        
        if (file.type.startsWith('image/')) {
          validImageCount++;
          console.log(`✅ Valid image file #${validImageCount}: ${file.name}`);
          uploadPromises.push(uploadImage(file, selectedCategory));
        } else {
          console.log(`⚠️ Skipping non-image file: ${file.name} (${file.type})`);
        }
      }
      
      if (validImageCount === 0) {
        throw new Error('Nepasirinktos tinkamos nuotraukos');
      }
      
      console.log(`🚀 Starting ${validImageCount} image uploads...`);
      addNotification(`Įkeliama ${validImageCount} nuotrauka(-os)...`, 'info');
      
      const uploadedImages = await Promise.all(uploadPromises);
      console.log('✅ All uploads completed:', {
        count: uploadedImages.length,
        images: uploadedImages.map(img => ({ id: img.id, fileName: img.fileName }))
      });
      
      await updateFirestoreImages(uploadedImages);
      
      addNotification(`🎉 ${uploadedImages.length} nuotrauka(-os) sėkmingai įkelta(-os)!`, 'success');
      
      // Clear progress
      setUploadProgress({});
      console.log('🧹 Upload progress cleared');
      
    } catch (error) {
      console.error('❌ File upload error:', {
        error: error.message,
        selectedCategory,
        validImageCount
      });
      addNotification(`Klaida įkeliant nuotraukas: ${error.message}`, 'error');
    } finally {
      setUploading(false);
      console.log('🏁 Upload process completed');
    }
  };

  // Handle drag and drop with debug logging
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      if (!dragActive) {
        console.log('🎯 Drag activated');
        setDragActive(true);
      }
    } else if (e.type === "dragleave") {
      console.log('🎯 Drag deactivated');
      setDragActive(false);
    }
  }, [dragActive]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    console.log('📥 Files dropped:', {
      filesCount: e.dataTransfer.files?.length || 0,
      selectedCategory
    });
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(Array.from(e.dataTransfer.files));
    }
  }, [selectedCategory]);

  // Camera functions with debug logging
  const startCamera = async () => {
    console.log('📸 Starting camera...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      console.log('✅ Camera stream obtained:', {
        tracks: stream.getTracks().map(track => ({ kind: track.kind, label: track.label }))
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      addNotification('Kamera sėkmingai įjungta', 'success');
    } catch (error) {
      console.error('❌ Camera error:', error);
      addNotification(`Nepavyko įjungti kameros: ${error.message}`, 'error');
    }
  };

  const stopCamera = () => {
    console.log('📸 Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🛑 Camera track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    setCameraActive(false);
    addNotification('Kamera išjungta', 'info');
  };

  const capturePhoto = async () => {
    console.log('📷 Capturing photo...');
    if (!videoRef.current || !canvasRef.current) {
      console.error('❌ Video or canvas ref not available');
      addNotification('Klaida fotografuojant', 'error');
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    console.log('📐 Canvas dimensions set:', {
      width: canvas.width,
      height: canvas.height
    });
    
    ctx.drawImage(video, 0, 0);
    
    canvas.toBlob(async (blob) => {
      if (blob) {
        const file = new File([blob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
        console.log('📷 Photo captured:', {
          fileName: file.name,
          size: file.size,
          type: file.type
        });
        addNotification('Nuotrauka nufotografuota', 'success');
        await handleFileUpload([file]);
      } else {
        console.error('❌ Failed to capture photo: blob is null');
        addNotification('Klaida fotografuojant', 'error');
      }
    }, 'image/jpeg', 0.8);
  };

  const existingImages = booking.images?.[imageType]?.images || [];
  const progressEntries = Object.entries(uploadProgress);

  console.log('🔄 Component render:', {
    existingImagesCount: existingImages.length,
    progressEntries: progressEntries.length,
    uploading,
    cameraActive,
    selectedCategory
  });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-ivory-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced Notifications */}
          <div className="fixed top-4 right-4 z-60 space-y-2">
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 100, scale: 0.8 }}
                  className={`px-4 py-3 rounded-lg shadow-lg min-w-[200px] ${
                    notification.type === 'error' 
                      ? 'bg-red-500 text-white border-l-4 border-red-700' 
                      : notification.type === 'info'
                      ? 'bg-blue-500 text-white border-l-4 border-blue-700'
                      : 'bg-sage-green text-white border-l-4 border-sage-green/80'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">
                      {notification.type === 'error' ? '❌' : 
                       notification.type === 'info' ? 'ℹ️' : '✅'}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{notification.message}</p>
                      <p className="text-xs opacity-80 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString('lt-LT')}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Header */}
          <div className="bg-sage-green text-white p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold font-syne">
              {imageType === 'before' ? '📸 Nuotraukos prieš nuomą' : '📸 Nuotraukos po nuomos'} - #{booking.bookingReference}
            </h2>
            <button
              onClick={() => {
                console.log('🚪 Closing modal...');
                stopCamera();
                onClose();
              }}
              className="text-white hover:text-sand-beige text-2xl transition-colors"
            >
              ×
            </button>
          </div>

          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Debug Info Panel (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
                <strong>🐛 Debug Info:</strong> Booking: {booking.id} | Type: {imageType} | Category: {selectedCategory} | 
                Existing: {existingImages.length} | Auth: {auth?.currentUser?.email || 'N/A'}
              </div>
            )}

            {/* Category Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-bold font-syne text-graphite-black mb-4">
                Pasirinkite kategoriją:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {IMAGE_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      console.log('🏷️ Category selected:', category.id);
                      setSelectedCategory(category.id);
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
                      selectedCategory === category.id
                        ? 'border-sage-green bg-sage-green text-white shadow-md'
                        : 'border-sand-beige hover:border-sage-green bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <div className="text-sm font-medium">{category.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Camera Section */}
              <div className="bg-white rounded-xl p-6 border border-sand-beige">
                <h4 className="font-bold font-syne text-graphite-black mb-4 flex items-center">
                  <span className="text-xl mr-3">📸</span>
                  Fotografuoti kamera
                </h4>
                
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
                    disabled={uploading}
                    className="w-full px-6 py-4 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 disabled:opacity-50 transition-all duration-200 font-medium"
                  >
                    Įjungti kamerą
                  </button>
                ) : (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg bg-graphite-black border border-sand-beige"
                      style={{ maxHeight: '200px' }}
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={capturePhoto}
                        disabled={uploading}
                        className="flex-1 px-4 py-3 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 disabled:opacity-50 transition-all duration-200 font-medium"
                      >
                        📷 Fotografuoti
                      </button>
                      <button
                        onClick={stopCamera}
                        className="px-4 py-3 bg-graphite-black/20 text-graphite-black rounded-lg hover:bg-graphite-black/30 transition-all duration-200"
                      >
                        Uždaryti
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* File Upload Section */}
              <div className="bg-white rounded-xl p-6 border border-sand-beige">
                <h4 className="font-bold font-syne text-graphite-black mb-4 flex items-center">
                  <span className="text-xl mr-3">📁</span>
                  Įkelti iš prietaiso
                </h4>
                
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                    dragActive
                      ? 'border-sage-green bg-sage-green/5'
                      : 'border-sand-beige hover:border-sage-green hover:bg-sage-green/5'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="text-4xl mb-3">📤</div>
                  <p className="text-sm text-graphite-black/70 mb-4">
                    Nutempkite nuotraukas čia arba
                  </p>
                  <button
                    onClick={() => {
                      console.log('📁 File input clicked');
                      fileInputRef.current?.click();
                    }}
                    disabled={uploading}
                    className="px-6 py-3 bg-sage-green text-white rounded-lg hover:bg-sage-green/90 disabled:opacity-50 transition-all duration-200 font-medium"
                  >
                    {uploading ? 'Įkeliama...' : 'Pasirinkti failus'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      console.log('📂 Files selected from input:', e.target.files?.length || 0);
                      handleFileUpload(Array.from(e.target.files || []));
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Upload Progress */}
            {progressEntries.length > 0 && (
              <div className="mb-6 bg-white rounded-xl p-6 border border-sand-beige">
                <h4 className="font-bold font-syne text-graphite-black mb-4">
                  📊 Įkėlimo progresas:
                </h4>
                <div className="space-y-3">
                  {progressEntries.map(([fileName, progress]) => (
                    <div key={fileName} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-graphite-black/70">{fileName}</span>
                        <span className="font-medium text-sage-green">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-sand-beige rounded-full h-2">
                        <div
                          className="bg-sage-green h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="bg-white rounded-xl p-6 border border-sand-beige">
                <h4 className="font-bold font-syne text-graphite-black mb-4">
                  📷 Įkeltos nuotraukos ({existingImages.length}):
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((image, index) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.downloadURL}
                        alt={`${image.category} ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-sand-beige hover:border-sage-green transition-colors"
                        onLoad={() => console.log('🖼️ Image loaded:', image.fileName)}
                        onError={() => console.error('❌ Failed to load image:', image.fileName)}
                      />
                      <div className="absolute top-2 right-2 bg-sage-green text-white text-xs px-2 py-1 rounded-full font-medium">
                        {IMAGE_CATEGORIES.find(cat => cat.id === image.category)?.icon}
                      </div>
                      <div className="absolute bottom-2 left-2 bg-graphite-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {IMAGE_CATEGORIES.find(cat => cat.id === image.category)?.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-sand-beige/20 px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-graphite-black/70">
              {uploading && '⏳ Įkeliama...'}
              {existingImages.length > 0 && !uploading && `📸 ${existingImages.length} nuotrauka(-os)`}
            </div>
            <button
              onClick={() => {
                console.log('🚪 Closing modal via footer button...');
                stopCamera();
                onClose();
              }}
              disabled={uploading}
              className="px-6 py-3 text-graphite-black bg-white border border-sand-beige rounded-lg hover:bg-graphite-black/5 transition-all duration-200 font-medium disabled:opacity-50"
            >
              {uploading ? 'Palaukite...' : 'Uždaryti'}
            </button>
          </div>

          {/* Hidden canvas for camera capture */}
          <canvas ref={canvasRef} className="hidden" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default ScooterImageUpload;