// Google Maps для локации
document.addEventListener('DOMContentLoaded', function() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Загружаем Google Maps API
  const script = document.createElement('script');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAD0YyYQlJ2AWu5Yo3vCANDLh_-dY93I0U&callback=initLocationMap';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});

// Инициализация карты
function initLocationMap() {
  const mapElement = document.getElementById('map');
  if (!mapElement) return;

  // Кастомный стиль карты (светлая тема)
  const customStyle = [
    {
      "featureType": "all",
      "elementType": "geometry",
      "stylers": [{ "color": "#f5f5f5" }]
    },
    {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [{ "color": "#666666" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [{ "color": "#ffffff" }]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [{ "color": "#e0e0e0" }]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [{ "color": "#e8f5e8" }]
    }
  ];

  // Создаем карту
  const map = new google.maps.Map(mapElement, {
    zoom: 15,
    center: { lat: 50.4501, lng: 30.5234 },
    styles: customStyle,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  // Добавляем маркер
  const marker = new google.maps.Marker({
    position: { lat: 50.4501, lng: 30.5234 },
    map: map,
    title: "Парковий Конгресно-виставковий центр"
  });

  // Информационное окно
  const infowindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 5px 0; color: #333;">Парковий Конгресно-виставковий центр</h3>
        <p style="margin: 0; color: #666; font-size: 14px;">Набережне шосе, 2</p>
      </div>
    `
  });

  // Открываем инфоокно при клике на маркер
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
} 