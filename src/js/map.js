// Google Maps Configuration
let mapConfig = {
  apiKey: window.mapConfig ? window.mapConfig.apiKey : "",
  center: { lat: 50.4501, lng: 30.5234 },
  zoom: 15,
  location: {
    title: "Парковий Конгресно-виставковий центр",
    address: "Набережне шосе, 2",
  },
};

// Кастомный стиль карты (светлая тема)
const customMapStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#666666",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "administrative",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#fefefe",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        color: "#f5f5f5",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        color: "#e8f5e8",
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#6b9a76",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#e0e0e0",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [
      {
        color: "#dadada",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [
      {
        color: "#b2b2b2",
      },
    ],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#616161",
      },
    ],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
  {
    featureType: "transit.line",
    elementType: "geometry",
    stylers: [
      {
        color: "#e5e5e5",
      },
    ],
  },
  {
    featureType: "transit.station",
    elementType: "geometry",
    stylers: [
      {
        color: "#eeeeee",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [
      {
        color: "#c9c9c9",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#9e9e9e",
      },
    ],
  },
];

// Инициализация карты
function initMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  // Создаем карту
  const map = new google.maps.Map(mapElement, {
    zoom: mapConfig.zoom,
    center: mapConfig.center,
    styles: customMapStyle,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  // Создаем кастомный маркер
  const marker = new google.maps.Marker({
    position: mapConfig.center,
    map: map,
    title: mapConfig.location.title,
    icon: {
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#666666"/>
        </svg>
      `),
      scaledSize: new google.maps.Size(24, 24),
      anchor: new google.maps.Point(12, 24),
    },
  });

  // Информационное окно
  const infowindow = new google.maps.InfoWindow({
    content: `
      <div style="padding: 10px; max-width: 200px;">
        <h3 style="margin: 0 0 5px 0; color: #333;">${mapConfig.location.title}</h3>
        <p style="margin: 0; color: #666; font-size: 14px;">${mapConfig.location.address}</p>
      </div>
    `,
  });

  // Открываем инфоокно при клике на маркер
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
}

// Загрузка Google Maps API
function loadGoogleMapsAPI() {
  if (typeof google !== "undefined" && google.maps) {
    initMap();
    return;
  }

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${mapConfig.apiKey}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// Экспорт функций для использования в других файлах
window.MapManager = {
  init: function (apiKey, config = {}) {
    mapConfig.apiKey = apiKey;
    Object.assign(mapConfig, config);
    loadGoogleMapsAPI();
  },
  setLocation: function (lat, lng, title, address) {
    mapConfig.center = { lat, lng };
    mapConfig.location = { title, address };
  },
};

// Автоматическая инициализация при загрузке DOM
document.addEventListener("DOMContentLoaded", () => {
  // Если API ключ уже установлен, инициализируем карту
  if (mapConfig.apiKey) {
    loadGoogleMapsAPI();
  }
});
