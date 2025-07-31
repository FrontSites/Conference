// Google Maps для локации
document.addEventListener("DOMContentLoaded", function () {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Проверяем наличие API ключа
  if (!window.mapConfig || !window.mapConfig.apiKey) {
    console.error("Google Maps API key not found");
    return;
  }

  // Загружаем Google Maps API с языком
  const script = document.createElement("script");
  const language = window.mapConfig.language || 'uk';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${window.mapConfig.apiKey}&language=${language}&callback=initLocationMap`;
  script.async = true;
  script.defer = true;

  // Обработка ошибок загрузки
  script.onerror = function () {
    console.error("Failed to load Google Maps API");
    const mapElement = document.getElementById("map");
    if (mapElement) {
      mapElement.innerHTML =
        '<div style="padding: 20px; text-align: center; color: #666;">Карта временно недоступна</div>';
    }
  };

  document.head.appendChild(script);
});

// Инициализация карты
function initLocationMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Обработка ошибок Google Maps
  if (typeof google === "undefined" || !google.maps) {
    console.error("Google Maps failed to load");
    mapElement.innerHTML =
      '<div style="padding: 20px; text-align: center; color: #666;">Карта временно недоступна</div>';
    return;
  }

  // Кастомный стиль карты (монохромный)
  const customStyle = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ffffff" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#cccccc" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#f0f0f0" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#999999" }],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#e0e0e0" }],
    },
    {
      featureType: "poi",
      elementType: "labels.icon",
      stylers: [{ color: "#666666" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#e8e8e8" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#d0d0d0" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#e0e0e0" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ color: "#666666" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f5f5" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry",
      stylers: [{ color: "#f0f0f0" }],
    },
    {
      featureType: "administrative",
      elementType: "labels.text.fill",
      stylers: [{ color: "#333333" }],
    },
  ];

  // Создаем карту
  const map = new google.maps.Map(mapElement, {
    zoom: 16,
    center: { lat: 50.44921066476974, lng: 30.5407736837048 },
    styles: customStyle,
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "cooperative",
  });

  // Определяем язык для мультиязычности
  const isEnglish = window.mapConfig.language === 'en';

  // Добавляем маркер с кастомным пином
  const marker = new google.maps.Marker({
    position: { lat: 50.44921066476974, lng: 30.5407736837048 },
    map: map,
    title: isEnglish ? "Parkovy Congress and Exhibition Center" : "Парковий Конгресно-виставковий центр",
    icon: {
      url: window.location.origin + '/wp-content/themes/conference/assets/images/pin.svg',
      scaledSize: new google.maps.Size(40, 40),
      anchor: new google.maps.Point(20, 40), // Центрируем пин по точке
    },
  });

  // Информационное окно с мультиязычностью
  const infowindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 5px 0; color: #333;">${isEnglish ? 'Parkovy Congress and Exhibition Center' : 'Парковий Конгресно-виставковий центр'}</h3>
        <p style="margin: 0; color: #666; font-size: 14px;">${isEnglish ? 'Naberezhne Shose, 2' : 'Набережне шосе, 2'}</p>
      </div>
    `,
  });

  // Открываем инфоокно при клике на маркер
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}
