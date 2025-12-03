
import './LocationSection.css';

function LocationSection() {
  const latitude = 2.519907641932134;
  const longitude = -75.32638543617601;
  
  const openInGoogleMaps = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="location-section" id='ubication'>
      
      <div className="location-header">
        <h2>Ubicación</h2>
      </div>

      
      <div className="map-container">
        <div 
          className="map-wrapper"
          onClick={openInGoogleMaps}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              openInGoogleMaps();
            }
          }}
          aria-label="Hacer click para abrir en Google Maps"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.123456789!2d-75.32638543617601!3d2.519907641932134!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwMzEnMTEuNyJOIDc1wrAxOSczNS4wIlc!5e0!3m2!1ses!2sco!4v1758320988736!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación del Restaurante Infusión"
          ></iframe>
          
          {/* Overlay para hacer click */}
          <div className="map-overlay">
            <div className="click-indicator">
              <span>📍 Click para abrir en Google Maps</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default LocationSection;