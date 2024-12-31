import React, { useState } from 'react';
import '../styles/App.css';
import { uploadImage } from '../services/api';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [otherPredictions, setOtherPredictions] = useState<Array<{ species: string, confidence: number }> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file)); // Create a URL for the selected image
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    try {
      const uploadResponse = await uploadImage(selectedFile);
      console.log('Upload Response:', uploadResponse); // Log the upload response

      // Assuming the response contains the species determination directly
      setResult(uploadResponse.predictions[0].class); // Adjust based on actual response structure
      setConfidence(uploadResponse.predictions[0].confidence); // Adjust based on actual response structure

      // Extract other potential species
      const otherPreds = uploadResponse.predictions.slice(1).map((pred: any) => ({
        species: pred.class,
        confidence: pred.confidence,
      }));
      setOtherPredictions(otherPreds);

      setError(null); // Clear any previous errors
      setShowModal(true); // Show the modal with results
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      setError('Error uploading image: ' + error.message);
    } finally {
      setLoading(false); // Set loading to false when upload completes
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="App">
      <div className="header">
        <div className="title">
          <h1>Fungi-Finder</h1>
        </div>
        <div className="creator">Created by Oran Dennehy</div>
      </div>
      <div className="upload-container">
        <input type="file" onChange={handleFileChange} className="upload-input" />
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Checking...' : 'Check Species'}
        </button>
        {loading && <div className="loading-bar"><div className="loading-progress"></div></div>}
      </div>
      {imageUrl && (
        <div className="image-preview">
          <img src={imageUrl} alt="Selected" className="preview-image" />
        </div>
      )}
      {error && <div className="error">{error}</div>}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Result: {result}</h2>
            <p>Confidence: {(confidence! * 100).toFixed(2)}%</p>
            <h3>Other Predictions:</h3>
            <ul className="predictions-list">
              {otherPredictions?.map((pred, index) => (
                <li key={index}>
                  {pred.species}: {(pred.confidence * 100).toFixed(2)}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <div className="footer">
        <a href="https://github.com/tldoran" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i>
        </a>
        <a href="https://linkedin.com/in/orandennehy" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-linkedin"></i>
        </a>
        <a href="https://www.orandennehy.com/" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-globe"></i>
        </a>
      </div>
    </div>
  );
};

export default App;