import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Button, 
  Box, 
  Group, 
  Alert, 
  Badge,
  Card,
  Stack,
  Center,
  Loader,
  Image,
  Divider,
  Progress
} from '@mantine/core';
import { 
  IconCamera, 
  IconVideo,
  IconCheck,
  IconAlertCircle,
  IconPhoto,
  IconArrowLeft,
  IconInfoCircle,
  IconArrowRight,
  IconEye,
  IconRecordMail,
  IconDownload,
  IconExternalLink
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

export function JotformAssignment() {
  const { jotformId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseName = searchParams.get('course');

  // Step management
  const [step, setStep] = useState('setup');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Webcam states
  const [webcamReady, setWebcamReady] = useState(false);
  const [webcamError, setWebcamError] = useState(null);
  
  // Photo states
  const [photoTaken, setPhotoTaken] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  
  // Assignment states
  const [formData, setFormData] = useState(null);
  const [jotformContent, setJotformContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Random number states
  const [randomInteger, setRandomInteger] = useState(null);
  const [randomNumber, setRandomNumber] = useState(null);
  const [processedPages, setProcessedPages] = useState([]);
  
  // Recording states
  const [currentRecording, setCurrentRecording] = useState(null);
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  
  // Proctoring states
  const [fullscreen, setFullscreen] = useState(false);
  const [monitoring, setMonitoring] = useState(false);
  const [showLiveVideo, setShowLiveVideo] = useState(true);
  
  // Face recognition states
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [lightingIssue, setLightingIssue] = useState(false);

  // Video modal states
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const webcamRef = useRef(null);
  const liveVideoRef = useRef(null);
  const faceCanvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  // Video constraints
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user"
  };

  const liveVideoConstraints = {
    width: 220,
    height: 165,
    facingMode: "user",
    frameRate: 30
  };

  // Initialize component and load face detection models
  useEffect(() => {
    const loadFaceModels = async () => {
      try {
        const MODEL_URL = '/models'; // Place face-api.js models in public/models folder
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
        ]);
        setModelsLoaded(true);
        console.log('Face recognition models loaded');
      } catch (error) {
        console.error('Error loading face models:', error);
      }
    };

    loadFaceModels();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Face detection logic
  useEffect(() => {
    if (modelsLoaded && step === 'exam') {
      const detectFaces = async () => {
        if (liveVideoRef.current && liveVideoRef.current.video && liveVideoRef.current.video.readyState === 4) {
          const video = liveVideoRef.current.video;
          const canvas = faceCanvasRef.current;

          if (canvas) {
            const detections = await faceapi.detectAllFaces(
              video, 
              new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 })
            );

            // Clear previous drawings
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Check lighting
            const brightness = await checkBrightness(video);
            setLightingIssue(brightness < 50);

            if (detections.length === 0) {
              setFaceDetected(false);
              setMultipleFaces(false);
              
              notifications.show({
                id: 'face-alert',
                title: 'Face Not Detected',
                message: 'Please stay visible in the webcam view',
                color: 'red',
                autoClose: 3000
              });
            } else if (detections.length > 1) {
              setFaceDetected(true);
              setMultipleFaces(true);
              
              notifications.show({
                id: 'multiple-faces',
                title: 'Multiple Faces Detected',
                message: 'Only you should be present during the exam',
                color: 'red',
                autoClose: 3000
              });
            } else {
              setFaceDetected(true);
              setMultipleFaces(false);
            }

            if (lightingIssue) {
              notifications.show({
                id: 'lighting-alert',
                title: 'Poor Lighting',
                message: 'Please ensure adequate lighting for face detection',
                color: 'orange',
                autoClose: 3000
              });
            }

            // Draw face detection boxes
            const resizedDetections = faceapi.resizeResults(detections, {
              width: video.videoWidth,
              height: video.videoHeight
            });
            
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            faceapi.draw.drawDetections(canvas, resizedDetections);
          }
        }
      };

      const interval = setInterval(detectFaces, 2000);
      return () => clearInterval(interval);
    }
  }, [modelsLoaded, step, lightingIssue]);

  // Check brightness level
  const checkBrightness = async (video) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.drawImage(video, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      brightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    
    return brightness / (data.length / 4);
  };

  // Enhanced console logging function
  const logSubmissionData = (data) => {
    console.group('🎯 ASSIGNMENT SUBMISSION');
    
    console.group('📚 Assignment Details');
    console.table(data.assignment);
    console.groupEnd();
    
    console.group('📝 Recorded Answers');
    data.answers.forEach((answer, index) => {
      console.group(`Video ${index + 1}`);
      console.log('Page:', answer.pageNumber);
      console.log('Question:', answer.questionText);
      console.log('File Size:', `${Math.round(answer.videoSize / 1024)} KB`);
      console.log('Timestamp:', new Date(answer.timestamp).toLocaleString());
      console.log('Video URL:', answer.videoUrl);
      console.groupEnd();
    });
    console.groupEnd();
    
    console.group('🔍 Proctoring Status');
    console.table(data.proctoring);
    console.groupEnd();
    
    console.group('👤 Identity Verification');
    console.log('Photo Captured:', data.identity.photoTaken);
    console.log('Photo Size:', data.identity.photo ? 'Available' : 'Not available');
    console.groupEnd();
    
    console.groupEnd();
  };

  // Handle webcam ready
  const handleUserMedia = (stream) => {
    setWebcamReady(true);
    streamRef.current = stream;
    setWebcamError(null);
    
    notifications.show({
      title: 'Camera Ready',
      message: 'Camera access granted successfully',
      color: 'green'
    });
  };

  // Handle webcam errors
  const handleUserMediaError = (error) => {
    setWebcamError(error.message);
    setWebcamReady(false);
    
    let errorMessage = 'Camera access is required for the exam';
    if (error.name === 'NotAllowedError') {
      errorMessage = 'Permission denied. Please allow camera access and reload the page.';
    } else if (error.name === 'NotFoundError') {
      errorMessage = 'No camera found on this device.';
    }
    
    notifications.show({
      title: 'Camera Error',
      message: errorMessage,
      color: 'red'
    });
  };

  // Take photo
  const takePhoto = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedPhoto(imageSrc);
        setPhotoTaken(true);
        
        notifications.show({
          title: 'Photo Captured',
          message: 'Your photo has been captured successfully',
          color: 'green'
        });
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedPhoto(null);
    setPhotoTaken(false);
  };

  // Load jotform content
  const loadJotformContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching jotform data for:', jotformId);
      
      const response = await axios.get(`http://localhost:8081/api/jotforms`);
      const foundForm = response.data.find(form => form.jotformName === jotformId);
      
      if (foundForm) {
        setFormData(foundForm);
        console.log('Found jotform data:', foundForm);
        
        // Extract randominteger value
        let randomInt = null;
        for (const page of foundForm.pages) {
          for (const element of page.elements) {
            if (element.tagName === 'randominteger') {
              randomInt = parseInt(element.content);
              break;
            }
          }
          if (randomInt) break;
        }
        
        if (randomInt) {
          setRandomInteger(randomInt);
          const generatedRandomNumber = Math.floor(Math.random() * randomInt) + 1;
          setRandomNumber(generatedRandomNumber);
          
          console.log('Random integer from API:', randomInt);
          console.log('Generated random number:', generatedRandomNumber);
          
          // Process pages
          const processedPagesData = foundForm.pages.map(page => {
            const paragraphs = page.elements
              .filter(elem => elem.tagName === 'paragraph')
              .sort((a, b) => a.sequence - b.sequence);
            
            const videoRecording = page.elements.find(elem => elem.tagName === 'videorecording');
            const selectedParagraph = paragraphs[generatedRandomNumber - 1];
            
            return {
              pageNumber: page.page,
              selectedParagraph: selectedParagraph || null,
              hasVideoRecording: !!videoRecording,
              videoRecording: videoRecording || null,
              totalParagraphs: paragraphs.length
            };
          });
          
          setProcessedPages(processedPagesData);
          console.log('Processed pages data:', processedPagesData);
          
          setCurrentPageIndex(0);
          
          setJotformContent({
            title: foundForm.title || `Assignment - ${courseName}`,
            pages: processedPagesData,
            randomNumber: generatedRandomNumber,
            ...foundForm
          });
          
          notifications.show({
            title: 'Assignment Loaded',
            message: `Assignment loaded. Showing question ${generatedRandomNumber} from each page.`,
            color: 'green'
          });
        } else {
          throw new Error('No randominteger element found in the form');
        }
      } else {
        console.log(`No jotform found with name: ${jotformId}`);
        throw new Error(`No jotform found with name: ${jotformId}`);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jotform data:', error);
      setError(error.message);
      setLoading(false);
      
      notifications.show({
        title: 'Error',
        message: 'Failed to load assignment content',
        color: 'red'
      });
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (currentPageIndex < processedPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      notifications.show({
        title: 'Next Page',
        message: `Moved to page ${currentPageIndex + 2}`,
        color: 'blue'
      });
    }
  };

  // Toggle live video
  const toggleLiveVideo = () => {
    setShowLiveVideo(!showLiveVideo);
  };

  // Enter fullscreen
  const enterFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
      setMonitoring(true);
      
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      
      notifications.show({
        title: 'Exam Mode Activated',
        message: 'You are now in secure exam mode',
        color: 'blue'
      });
    }
  };

  const handleFullscreenChange = () => {
    if (!document.fullscreenElement) {
      setFullscreen(false);
      notifications.show({
        title: 'Warning: Fullscreen Exited',
        message: 'Exiting fullscreen mode may be flagged as suspicious activity',
        color: 'orange'
      });
    }
  };

  // Start recording with video and audio
  const startRecording = async () => {
    if (streamRef.current && !currentRecording) {
      try {
        const mediaRecorder = new MediaRecorder(streamRef.current, {
          mimeType: 'video/webm; codecs=vp9,opus',
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000
        });
        
        const chunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          
          const currentPage = processedPages[currentPageIndex];
          const questionData = {
            id: Date.now(),
            blob,
            url,
            pageNumber: currentPageIndex + 1,
            questionText: currentPage.selectedParagraph?.content || 'No question text',
            timestamp: new Date().toISOString(),
            randomQuestionNumber: randomNumber
          };
          
          setRecordedAnswers(prev => [...prev, questionData]);
          
          // Send to backend
          sendAnswerToBackend(questionData);
          
          setCurrentRecording(null);
          notifications.show({
            title: 'Recording Saved',
            message: `Answer recorded for page ${currentPageIndex + 1}`,
            color: 'green'
          });
        };
        
        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
        setCurrentRecording({ startTime: Date.now(), pageNumber: currentPageIndex + 1 });
        
        notifications.show({
          title: 'Recording Started',
          message: 'Recording your video answer...',
          color: 'blue'
        });
        
      } catch (error) {
        notifications.show({
          title: 'Recording Failed',
          message: 'Failed to start recording. Please try again.',
          color: 'red'
        });
      }
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && currentRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // Send answer to backend
  const sendAnswerToBackend = async (answerData) => {
    try {
      const formData = new FormData();
      formData.append('video', answerData.blob, `answer_page_${answerData.pageNumber}.webm`);
      formData.append('questionText', answerData.questionText);
      formData.append('pageNumber', answerData.pageNumber);
      formData.append('randomQuestionNumber', answerData.randomQuestionNumber);
      formData.append('timestamp', answerData.timestamp);
      formData.append('jotformId', jotformId);
      formData.append('courseName', courseName);
      console.log(formdata)
      // Replace with your actual API endpoint
      await axios.post('http://localhost:8081/api/submit-answer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Answer sent to backend successfully');
    } catch (error) {
      console.error('Error sending answer to backend:', error);
    }
  };

  // Submit assignment with console logging and video preview
  const submitAssignment = async () => {
    try {
      // Prepare all submission data
      const completeSubmissionData = {
        assignment: {
          jotformId: jotformId,
          courseName: courseName,
          title: jotformContent?.title,
          totalPages: processedPages.length,
          randomNumber: randomNumber,
          randomInteger: randomInteger
        },
        identity: {
          photo: capturedPhoto,
          photoTaken: photoTaken
        },
        answers: recordedAnswers.map(answer => ({
          id: answer.id,
          pageNumber: answer.pageNumber,
          questionText: answer.questionText,
          timestamp: answer.timestamp,
          randomQuestionNumber: answer.randomQuestionNumber,
          videoUrl: answer.url,
          videoSize: answer.blob.size,
          videoType: answer.blob.type
        })),
        proctoring: {
          faceDetected: faceDetected,
          multipleFaces: multipleFaces,
          lightingIssue: lightingIssue,
          modelsLoaded: modelsLoaded
        },
        session: {
          submissionTime: new Date().toISOString(),
          totalRecordedAnswers: recordedAnswers.length,
          timeSpent: Date.now() - (Date.now() - 3600000)
        }
      };

      // 📋 CONSOLE LOG ALL DATA
      console.log('='.repeat(80));
      console.log('🎯 ASSIGNMENT SUBMISSION DATA');
      console.log('='.repeat(80));
      console.log('📚 Assignment Info:', completeSubmissionData.assignment);
      console.log('👤 Identity Data:', completeSubmissionData.identity);
      console.log('📝 Answers Data:', completeSubmissionData.answers);
      console.log('🔍 Proctoring Data:', completeSubmissionData.proctoring);
      console.log('⏱️ Session Data:', completeSubmissionData.session);
      console.log('='.repeat(80));

      // Enhanced logging
      logSubmissionData(completeSubmissionData);

      // 📹 DISPLAY RECORDED VIDEOS
      console.log('🎬 RECORDED VIDEOS:');
      recordedAnswers.forEach((answer, index) => {
        console.log(`Video ${index + 1}:`, {
          page: answer.pageNumber,
          question: answer.questionText,
          duration: answer.blob.size,
          url: answer.url
        });
      });

      // 🎥 OPEN VIDEO VIEWER MODAL
      setShowVideoModal(true);
      
      // Prepare FormData for backend submission
      const formData = new FormData();
      
      // Add recorded video answers
      recordedAnswers.forEach((answer, index) => {
        formData.append(`video_${index}`, answer.blob, `answer_page_${answer.pageNumber}.webm`);
        formData.append(`question_${index}`, answer.questionText);
        formData.append(`page_${index}`, answer.pageNumber);
        formData.append(`timestamp_${index}`, answer.timestamp);
      });
      
      // Add identity photo
      if (capturedPhoto) {
        const response = await fetch(capturedPhoto);
        const photoBlob = await response.blob();
        formData.append('identity_photo', photoBlob, 'identity_photo.jpg');
      }
      
      // Add metadata as JSON
      formData.append('submission_data', JSON.stringify(completeSubmissionData));
      
      // 📤 LOG FORM DATA
      console.log('📤 FORM DATA BEING SENT TO BACKEND:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Uncomment to submit to backend
      // const response = await axios.post('http://localhost:8081/api/submit-assignment', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      // console.log('✅ Backend Response:', response.data);
      
      notifications.show({
        title: 'Assignment Submitted',
        message: 'Check console for all data. Videos will open in modal.',
        color: 'green'
      });
      
    } catch (error) {
      console.error('❌ SUBMISSION ERROR:', error);
      notifications.show({
        title: 'Submission Failed',
        message: 'Failed to submit assignment. Check console for details.',
        color: 'red'
      });
    }
  };

  // Go back
  const goBack = () => {
    if (window.confirm('Are you sure you want to exit the assignment? Your progress will be lost.')) {
      navigate(-1);
    }
  };

  // SETUP STEP
  if (step === 'setup') {
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center" mb="xl">
          Assignment Setup - {courseName}
        </Title>
        
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Title order={4} mb="md">Camera & Proctoring Setup</Title>
          <Text size="sm" color="dimmed" mb="md">
            Please allow camera and microphone access. Face recognition will monitor your exam.
          </Text>
          
          <Stack>
            <Group justify="space-between">
              <Group>
                <IconCamera size={20} />
                <Text>Camera & Microphone Access</Text>
                {webcamReady && <Badge color="green" size="sm">Ready</Badge>}
                {webcamError && <Badge color="red" size="sm">Error</Badge>}
              </Group>
            </Group>

            {webcamError && (
              <Alert icon={<IconAlertCircle size={16} />} color="red" size="sm">
                <Text size="sm">
                  <strong>Camera Error:</strong> {webcamError}
                </Text>
              </Alert>
            )}
            
            <Box ta="center" mb="md">
              <Text size="sm" mb="md">Camera Preview</Text>
              <Center>
                <Webcam
                  audio={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={300}
                  height={200}
                  videoConstraints={videoConstraints}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                  style={{ 
                    borderRadius: 8, 
                    backgroundColor: '#000',
                    border: webcamReady ? '2px solid #51cf66' : '2px solid #868e96'
                  }}
                />
              </Center>
              {webcamReady && (
                <Badge color="green" size="sm" mt="sm">Live Camera Feed</Badge>
              )}
            </Box>
          </Stack>
        </Card>

        <Group justify="space-between">
          <Button variant="outline" onClick={goBack} leftSection={<IconArrowLeft size={16} />}>
            Back to Instructions
          </Button>
          
          {webcamReady && (
            <Button onClick={() => setStep('photo')} size="lg">
              Continue to Photo Capture
            </Button>
          )}
        </Group>

        {!webcamReady && (
          <Alert icon={<IconAlertCircle size={16} />} color="orange" mt="md">
            <Text size="sm">
              Please allow camera and microphone access to proceed with the exam.
            </Text>
          </Alert>
        )}
      </Container>
    );
  }

  // PHOTO CAPTURE STEP
  if (step === 'photo') {
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center" mb="xl">
          Identity Photo Capture
        </Title>
        
        <Card shadow="sm" padding="lg" radius="md" mb="xl">
          <Title order={4} mb="md">Take Your Photo</Title>
          <Text size="sm" color="dimmed" mb="md">
            Take a clear photo for identity verification.
          </Text>

          <Center mb="lg">
            {!photoTaken ? (
              <Box ta="center">
                <Webcam
                  audio={true}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  width={400}
                  height={300}
                  videoConstraints={videoConstraints}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                  style={{ 
                    borderRadius: 8, 
                    marginBottom: 16,
                    backgroundColor: '#000',
                    border: '2px solid #339af0'
                  }}
                />
                <Group justify="center">
                  <Button 
                    leftSection={<IconPhoto size={16} />}
                    onClick={takePhoto}
                    size="lg"
                    color="blue"
                    disabled={!webcamReady}
                  >
                    Take Photo
                  </Button>
                </Group>
              </Box>
            ) : (
              <Box ta="center">
                <Image 
                  src={capturedPhoto}
                  alt="Identity photo"
                  style={{ 
                    width: 400, 
                    height: 300, 
                    borderRadius: 8, 
                    marginBottom: 16
                  }}
                />
                <Group justify="center">
                  <Button 
                    variant="outline"
                    onClick={retakePhoto}
                    leftSection={<IconCamera size={16} />}
                  >
                    Retake Photo
                  </Button>
                  <Button 
                    onClick={() => setStep('verification')}
                    leftSection={<IconCheck size={16} />}
                    color="green"
                  >
                    Use This Photo
                  </Button>
                </Group>
              </Box>
            )}
          </Center>

          <Alert icon={<IconInfoCircle size={16} />} color="blue">
            <Text size="sm">
              Make sure your face is clearly visible and well-lit. 
              This photo will be used for identity verification during the exam.
            </Text>
          </Alert>
        </Card>

        <Group justify="space-between">
          <Button variant="outline" onClick={() => setStep('setup')} leftSection={<IconArrowLeft size={16} />}>
            Back to Setup
          </Button>
        </Group>
      </Container>
    );
  }

  // VERIFICATION STEP
  if (step === 'verification') {
    return (
      <Container size="md" py="xl">
        <Title order={2} ta="center" mb="xl">
          Identity Verification
        </Title>
        
        <Stack>
          <Card shadow="sm" padding="lg" radius="md">
            <Group justify="space-between" mb="md">
              <Group>
                <IconPhoto size={20} />
                <Text>Identity Photo</Text>
                {photoTaken && <Badge color="green" size="sm">Captured</Badge>}
              </Group>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setStep('photo')}
              >
                Change Photo
              </Button>
            </Group>
            {capturedPhoto && (
              <Center>
                <Image 
                  src={capturedPhoto} 
                  alt="Identity photo"
                  style={{ width: 200, height: 150, borderRadius: 8 }}
                />
              </Center>
            )}
          </Card>

          {photoTaken && (
            <Card shadow="sm" padding="lg" radius="md">
              <Alert icon={<IconAlertCircle size={16} />} color="orange" mb="md">
                <Text size="sm">
                  The exam will start in fullscreen mode with live face recognition monitoring. 
                  You cannot go back to previous questions once you proceed.
                </Text>
              </Alert>
              <Center>
                <Button 
                  onClick={() => {
                    loadJotformContent();
                    setStep('exam');
                    setTimeout(enterFullscreen, 1000);
                  }} 
                  size="lg" 
                  color="green"
                  leftSection={<IconCheck size={16} />}
                >
                  Start Assignment
                </Button>
              </Center>
            </Card>
          )}
        </Stack>

        <Group justify="space-between" mt="md">
          <Button variant="outline" onClick={() => setStep('photo')} leftSection={<IconArrowLeft size={16} />}>
            Back to Photo
          </Button>
        </Group>
      </Container>
    );
  }

  // EXAM STEP
  if (step === 'exam') {
    if (loading) {
      return (
        <Container size="xl" py="xl">
          <Center>
            <Stack align="center">
              <Loader size="lg" />
              <Text ta="center">Loading Assignment...</Text>
            </Stack>
          </Center>
        </Container>
      );
    }

    if (error) {
      return (
        <Container size="md" py="xl">
          <Alert icon={<IconAlertCircle size={16} />} color="red">
            <Text size="sm">Error: {error}</Text>
            <Button size="sm" mt="md" onClick={loadJotformContent}>
              Retry
            </Button>
          </Alert>
        </Container>
      );
    }

    if (!processedPages.length) {
      return (
        <Container size="md" py="xl">
          <Center>
            <Text>No pages to display</Text>
          </Center>
        </Container>
      );
    }

    const currentPage = processedPages[currentPageIndex];
    const isLastPage = currentPageIndex === processedPages.length - 1;
    const progressPercentage = ((currentPageIndex + 1) / processedPages.length) * 100;

    return (
      <Box>
        {/* CSS */}
        <style>{`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}</style>

        {/* Video Preview Modal */}
        {showVideoModal && (
          <Box style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Card shadow="xl" padding="xl" radius="md" style={{ 
              maxWidth: '90vw', 
              maxHeight: '90vh',
              width: 800
            }}>
              <Group justify="space-between" mb="md">
                <Title order={3}>Recorded Videos ({recordedAnswers.length})</Title>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowVideoModal(false)}
                >
                  Close
                </Button>
              </Group>

              {recordedAnswers.length > 0 && (
                <Stack>
                  {/* Video Navigation */}
                  <Group justify="center" mb="md">
                    {recordedAnswers.map((_, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={currentVideoIndex === index ? 'filled' : 'outline'}
                        onClick={() => setCurrentVideoIndex(index)}
                      >
                        Video {index + 1}
                      </Button>
                    ))}
                  </Group>

                  {/* Current Video Display */}
                  <Box ta="center">
                    <Badge color="blue" size="lg" mb="md">
                      Page {recordedAnswers[currentVideoIndex]?.pageNumber} - Question {randomNumber}
                    </Badge>
                    
                    <Text size="sm" mb="md" style={{ 
                      maxHeight: 100, 
                      overflow: 'auto',
                      padding: 10,
                      backgroundColor: '#f8f9fa',
                      borderRadius: 8
                    }}>
                      <strong>Question:</strong> {recordedAnswers[currentVideoIndex]?.questionText}
                    </Text>

                    {/* Video Player */}
                    <video
                      controls
                      width="100%"
                      height="400"
                      style={{ 
                        borderRadius: 8,
                        backgroundColor: '#000'
                      }}
                      src={recordedAnswers[currentVideoIndex]?.url}
                    >
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Info */}
                    <Group justify="space-around" mt="md">
                      <Text size="sm" color="dimmed">
                        <strong>Recorded:</strong> {new Date(recordedAnswers[currentVideoIndex]?.timestamp).toLocaleString()}
                      </Text>
                      <Text size="sm" color="dimmed">
                        <strong>Size:</strong> {Math.round(recordedAnswers[currentVideoIndex]?.blob.size / 1024)} KB
                      </Text>
                      <Text size="sm" color="dimmed">
                        <strong>Type:</strong> {recordedAnswers[currentVideoIndex]?.blob.type}
                      </Text>
                    </Group>
                  </Box>

                  {/* Action Buttons */}
                  <Group justify="center" mt="md">
                    <Button
                      leftSection={<IconDownload size={16} />}
                      onClick={() => {
                        const video = recordedAnswers[currentVideoIndex];
                        const link = document.createElement('a');
                        link.href = video.url;
                        link.download = `answer_page_${video.pageNumber}.webm`;
                        link.click();
                      }}
                    >
                      Download Current Video
                    </Button>
                    
                    <Button
                      variant="outline"
                      leftSection={<IconExternalLink size={16} />}
                      onClick={() => {
                        window.open(recordedAnswers[currentVideoIndex]?.url, '_blank');
                      }}
                    >
                      Open in New Tab
                    </Button>
                    
                    <Button
                      color="green"
                      leftSection={<IconCheck size={16} />}
                      onClick={() => {
                        setShowVideoModal(false);
                        setStep('completed');
                      }}
                    >
                      Continue to Complete
                    </Button>
                  </Group>
                </Stack>
              )}

              {recordedAnswers.length === 0 && (
                <Center>
                  <Stack align="center">
                    <Text color="dimmed">No videos recorded</Text>
                    <Button onClick={() => setShowVideoModal(false)}>Close</Button>
                  </Stack>
                </Center>
              )}
            </Card>
          </Box>
        )}

        {/* Status Bar */}
        <Box style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          background: '#1a1a1a', 
          color: 'white', 
          padding: '8px 16px',
          zIndex: 1001,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Group>
            <Badge color="red" variant="dot">MONITORING ACTIVE</Badge>
            <Badge color="blue" variant="dot">RECORDING READY</Badge>
            <Text size="sm">{courseName} - Page {currentPageIndex + 1} of {processedPages.length}</Text>
          </Group>
          <Group>
            <Badge color={faceDetected ? 'green' : 'red'} size="sm">
              {faceDetected ? 'Face OK' : 'No Face'}
            </Badge>
            {multipleFaces && <Badge color="red" size="sm">Multiple Faces</Badge>}
            {lightingIssue && <Badge color="orange" size="sm">Low Light</Badge>}
            <Button size="xs" variant="subtle" onClick={toggleLiveVideo}>
              <IconEye size={14} />
              {showLiveVideo ? ' Hide Video' : ' Show Video'}
            </Button>
            {!fullscreen && (
              <Button size="xs" onClick={enterFullscreen}>
                Enter Fullscreen
              </Button>
            )}
            {isLastPage && (
              <Button size="xs" color="red" onClick={submitAssignment}>
                Submit Assignment
              </Button>
            )}
          </Group>
        </Box>

        {/* Live Video with Face Recognition */}
        {showLiveVideo && (
          <Box style={{
            position: 'fixed',
            top: 60,
            right: 20,
            width: 220,
            height: 165,
            zIndex: 1000,
            border: `3px solid ${faceDetected ? '#51cf66' : '#ff6b6b'}`,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: '#000',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}>
            <Webcam
              audio={false} // No audio to prevent echo
              ref={liveVideoRef}
              mirrored={true}
              muted={true} // Muted to prevent feedback
              screenshotFormat="image/jpeg"
              videoConstraints={liveVideoConstraints}
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }}
            />
            
            {/* Face detection canvas overlay */}
            <canvas
              ref={faceCanvasRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none'
              }}
            />
            
            {/* Live indicator */}
            <Box style={{
              position: 'absolute',
              top: 8,
              left: 8,
              background: '#ff4757',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 4,
              fontSize: '11px',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <div style={{
                width: 8,
                height: 8,
                background: 'white',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              LIVE
            </Box>
            
            {/* Recording indicator */}
            {currentRecording && (
              <Box style={{
                position: 'absolute',
                top: 8,
                right: 8,
                background: '#ff4757',
                color: 'white',
                padding: '4px 8px',
                borderRadius: 4,
                fontSize: '11px',
                fontWeight: 'bold'
              }}>
                REC {Math.floor((Date.now() - currentRecording.startTime) / 1000)}s
              </Box>
            )}
            
            {/* Face status */}
            <Box style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: `linear-gradient(to top, ${faceDetected ? 'rgba(81, 207, 102, 0.9)' : 'rgba(255, 107, 107, 0.9)'}, transparent)`,
              color: 'white',
              padding: '8px',
              fontSize: '10px',
              textAlign: 'center',
              fontWeight: 'bold'
            }}>
              {faceDetected ? 'FACE DETECTED' : 'NO FACE'}
            </Box>
          </Box>
        )}

        {/* Hidden Webcam for Recording */}
        <Box style={{ position: 'fixed', top: -1000, left: -1000 }}>
          <Webcam
            audio={true} // Audio enabled for recording
            muted={true} // But muted for playback to prevent echo
            ref={webcamRef}
            onUserMedia={handleUserMedia}
            videoConstraints={videoConstraints}
          />
        </Box>

        {/* Main Content */}
        <Container size="xl" py="md" pt={60} style={{ paddingRight: showLiveVideo ? 260 : 20 }}>
          <Box>
            <Title order={3} mb="md" ta="center">
              Assignment: {jotformContent.title}
            </Title>
            
            {/* Progress */}
            <Card shadow="sm" padding="sm" radius="md" mb="lg">
              <Group justify="space-between" mb="xs">
                <Text size="sm" weight={500}>Progress</Text>
                <Text size="sm" color="dimmed">
                  Page {currentPageIndex + 1} of {processedPages.length}
                </Text>
              </Group>
              <Progress value={progressPercentage} size="sm" color="blue" />
            </Card>
            
            <Alert icon={<IconInfoCircle size={16} />} color="blue" mb="lg">
              <Group justify="space-between" align="center">
                <Text size="sm">
                  Question {randomNumber} selected randomly from {randomInteger} available questions
                </Text>
                <Group>
                  <Badge color="orange" size="sm" leftSection={<IconEye size={12} />}>
                    You are being monitored
                  </Badge>
                  {showLiveVideo && (
                    <Badge color="red" size="sm" leftSection={<IconVideo size={12} />}>
                      Live Video Active
                    </Badge>
                  )}
                </Group>
              </Group>
            </Alert>
            
            {/* Current Page Content */}
            <Card shadow="lg" padding="xl" radius="md" mb="lg">
              <Group justify="space-between" mb="md">
                <Title order={4}>Page {currentPage.pageNumber}</Title>
                <Badge color="blue" size="lg">
                  QUESTION {randomNumber} OF {currentPage.totalParagraphs}
                </Badge>
              </Group>
              
              {/* Question Text */}
              {currentPage.selectedParagraph ? (
                <Box mb="lg">
                  <Text size="lg" mb="md" style={{ lineHeight: 1.8, fontSize: '18px' }}>
                    {currentPage.selectedParagraph.content}
                  </Text>
                </Box>
              ) : (
                <Alert color="orange" mb="lg">
                  <Text size="sm">
                    No paragraph available for question {randomNumber} on this page.
                  </Text>
                </Alert>
              )}
              
              {/* Video Recording Section */}
              {currentPage.hasVideoRecording && (
                <Box>
                  <Divider my="lg" />
                  <Group justify="space-between" align="center" mb="md">
                    <Text weight={600} size="md">
                      Record your answer for this question:
                    </Text>
                    <Badge color="red" variant="dot" size="md">
                      VIDEO RESPONSE REQUIRED
                    </Badge>
                  </Group>
                  
                  <Box p="xl" style={{ 
                    border: '2px dashed #dee2e6', 
                    borderRadius: 12,
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    minHeight: 120
                  }}>
                    <IconVideo size={56} color="#868e96" style={{ marginBottom: 16 }} />
                    <Text size="sm" color="dimmed" mb="md">
                      Click "Record Answer" to record your video response with audio. 
                      Your answer will be automatically sent to the backend.
                    </Text>
                    {recordedAnswers.some(answer => answer.pageNumber === currentPageIndex + 1) && (
                      <Badge color="green" size="lg" mt="sm" leftSection={<IconCheck size={14} />}>
                        Answer recorded for this page
                      </Badge>
                    )}
                  </Box>
                  
                  {/* Record Answer Button - Center Aligned */}
                  <Center mt="xl">
                    {!currentRecording ? (
                      <Button
                        leftSection={<IconRecordMail size={18} />}
                        onClick={startRecording}
                        color="red"
                        size="xl"
                        style={{ 
                          fontSize: '16px',
                          padding: '16px 32px',
                          boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)'
                        }}
                      >
                        Record Answer
                      </Button>
                    ) : (
                      <Button
                        leftSection={<IconCheck size={18} />}
                        onClick={stopRecording}
                        color="green"
                        size="xl"
                        style={{ 
                          fontSize: '16px',
                          padding: '16px 32px',
                          boxShadow: '0 4px 12px rgba(81, 207, 102, 0.3)'
                        }}
                      >
                        Stop Recording ({Math.floor((Date.now() - currentRecording.startTime) / 1000)}s)
                      </Button>
                    )}
                  </Center>
                </Box>
              )}
            </Card>

            {/* Navigation */}
            <Card shadow="sm" padding="lg" radius="md" style={{ backgroundColor: '#f8f9fa' }}>
              <Group justify="space-between" align="center">
                <Box>
                  <Text size="sm" color="dimmed" weight={500}>
                    Page {currentPageIndex + 1} of {processedPages.length}
                  </Text>
                  <Text size="xs" color="dimmed">
                    No going back once you proceed
                  </Text>
                </Box>
                
                {!isLastPage ? (
                  <Button
                    onClick={handleNextPage}
                    size="lg"
                    rightSection={<IconArrowRight size={16} />}
                    color="blue"
                  >
                    Next Page
                  </Button>
                ) : (
                  <Button
                    onClick={submitAssignment}
                    size="lg"
                    leftSection={<IconCheck size={16} />}
                    color="green"
                  >
                    Submit Assignment
                  </Button>
                )}
              </Group>
            </Card>
          </Box>
        </Container>

        {/* Recording Counter */}
        {recordedAnswers.length > 0 && (
          <Box style={{
            position: 'fixed',
            bottom: 20,
            left: 20,
            zIndex: 1001
          }}>
            <Badge color="blue" size="xl" style={{ fontSize: '14px', padding: '12px' }}>
              Recorded Answers: {recordedAnswers.length}
            </Badge>
          </Box>
        )}
      </Box>
    );
  }

  // COMPLETED STEP
  if (step === 'completed') {
    return (
      <Container size="md" py="xl">
        <Center>
          <Stack align="center">
            <IconCheck size={64} color="green" />
            <Title order={2}>Assignment Completed</Title>
            <Text ta="center" color="dimmed">
              Your assignment has been submitted successfully.
            </Text>
            <Group>
              <Text size="sm" color="dimmed">
                Recorded answers: {recordedAnswers.length}
              </Text>
              <Text size="sm" color="dimmed">
                Pages completed: {processedPages.length}
              </Text>
              <Text size="sm" color="dimmed">
                Selected Question: {randomNumber}
              </Text>
            </Group>
            <Button onClick={() => navigate('/dashboard')} mt="lg" size="lg">
              Return to Dashboard
            </Button>
          </Stack>
        </Center>
      </Container>
    );
  }

  return null;
}
