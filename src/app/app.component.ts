import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
import { RouterOutlet } from '@angular/router';
import { CommunicationService } from './services/communication.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoogleMapsModule, HttpClientModule],  // Add HttpClientModule here
  providers: [CommunicationService],  // Add the service to providers
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'route-optimization';
  optimizationResults: any;
  directionsService: any;
  directionsRenderer: any;
  center: any;
  directionsResults$: any;
  @ViewChild('map') map: GoogleMap | undefined;
  bounds: any;
  mapOptions: any;
  // Define an array of colors for routes
colorPalette = [
  '#FF5252', // Red
  '#448AFF', // Blue
  '#66BB6A', // Green
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#E91E63', // Pink
  '#009688', // Teal
  '#673AB7', // Deep Purple
  '#3F51B5'  // Indigo
];


// Store renderers to keep reference
directionsRenderers: google.maps.DirectionsRenderer[] = [];
  
  constructor(private communicationService: CommunicationService, private mapDirectionsService: MapDirectionsService,private http: HttpClient,private ngZone: NgZone) {
    this.directionsResults$ = new Observable<google.maps.DirectionsResult|null>();
  }

  // Warehouse marker properties
  warehouseMarker: google.maps.Marker | undefined;
  warehousePosition = { lat: -6.23639, lng: 106.50833 };


  addWarehouseMarker() {
    if (!this.map?.googleMap) return;

    // Custom warehouse icon
    const warehouseIcon = {
      url: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png', // Default fallback
      scaledSize: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(20, 20)
    };

    try {
      // Create a custom SVG icon for a warehouse
      const warehouseSvgIcon = {
        path: 'M3,3V21H21V3H3M12,9H19V19H12V9Z M5,5H19V7H5V5M5,9H10V11H5V9M5,13H10V15H5V13M5,17H10V19H5V17Z',
        fillColor: '#FFA000',
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#000000',
        scale: 1.5,
        anchor: new google.maps.Point(12, 12)
      };

      // Add the warehouse marker
      const marker = new google.maps.Marker({
        position: { lat: -6.23639, lng: 106.50833 },
        map: this.map.googleMap,
        title: 'Warehouse Location',
        icon: warehouseSvgIcon,
        animation: google.maps.Animation.DROP
      });

      // Add info window
      const infoWindow = new google.maps.InfoWindow({
        content: '<div style="padding: 5px;"><strong>Main Warehouse</strong><br>Tangerang, Indonesia</div>'
      });

      marker.addListener('click', () => {
        infoWindow.open(this.map?.googleMap, marker);
      });
    } catch (error) {
      console.error('Error adding warehouse marker', error);
    }
  }
  
  ngAfterViewInit(): void {
    this.initMap();
    const requestBody = {
      "central_warehouse": {
        "id": "W1",
        "location": [
          -6.23639,106.50833
        ]
      },
      "warehouses": [
        {
          "id": "W2",
          "location": [
            -7.263692293355166, 112.6903636136195
          ],
          "capacity": 10000
        }
      ],
      "stores": [
        {
          "id": "Sociolla Kota Kasablanka",
          "location": [
            -6.2229517, 106.8403364
          ],
          "demand": 200
        },
        {
          "id": "Sociolla Lippo Mall Puri",
          "location": [
            -6.1877501, 106.7374668
          ],
          "demand": 150
        },
        {
          "id": "Sociolla Tunjungan Plaza 6",
          "location": [
            -7.2618939,112.7358567
          ],
          "demand": 300
        },
        {
          "id": "Sociolla Bintaro Exchange Jakarta",
          "location": [
            -6.2860061,106.7279553
          ],
          "demand": 300
        },
        {
          "id": "Sociolla Senayan Park",
          "location": [
            -6.2124261,106.8017855
          ],
          "demand": 300
        }
      ],
      "orders": [
        {
          "store_id": "Sociolla Kota Kasablanka",
          "volume": 200,
          "weight": 500
        },
        {
          "store_id": "Sociolla Lippo Mall Puri",
          "volume": 150,
          "weight": 400
        },
        {
          "store_id": "Sociolla Tunjungan Plaza 6",
          "volume": 300,
          "weight": 700
        },
        {
          "store_id": "Sociolla Bintaro Exchange Jakarta",
          "volume": 150,
          "weight": 400
        },
        {
          "store_id": "Sociolla Senayan Park",
          "volume": 300,
          "weight": 700
        }
      ],
      "truck_capacities": {
        "small": 1000,
        "medium": 5000,
        "large": 10000
      },
      "use_google_maps": true,
      "google_maps_api_key": "AIzaSyDdFVzDbj97kwGfXimf8rq9H9Uw-qCcuqs"
    };
    this.
    mapOptions = {
      center: { lat: -6.23639, lng: 106.50833 }, // Warehouse coordinates
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true,
      styles: [], // Custom map styles can be added here
      gestureHandling: 'auto'
    };
    // Wait for the map to be initialized
    setTimeout(() => {
      if (this.map && this.map.googleMap) {
        // Add the warehouse marker
        this.addWarehouseMarker();
      }
    }, 300);
    
    this.communicationService.getOptimizationResults(requestBody).subscribe({
      next: (response) => {
        var res = JSON.parse(response.body);
        console.log('Optimization results:', response);
        this.optimizationResults = response;
        this.addStoreMarkers(requestBody);
        this.routing(res.maps_urls.direct_routes);
        this.routing(res.maps_urls.
          warehouse_routes
          .W2.central_to_warehouse
        );
        this.routing(res.maps_urls.
          warehouse_routes
          .W2.
          warehouse_to_stores
          
        );
      
      // Request directions and update the map
      // this.directionsResults$ = this.mapDirectionsService.route(request).pipe(
      //   tap({
      //     next: response => console.log("Response received:", response),
      //     error: err => console.error("Error fetching directions:", err)
      //   }),
      //   map(response => {
      //     if (response.result && response.result.routes) { // Ensure result is present
      //       const bounds = new google.maps.LatLngBounds();
      //       response.result.routes[0].legs.forEach(leg => {
      //         bounds.extend(leg.start_location);
      //         bounds.extend(leg.end_location);
      //       });
      //       this.map.fitBounds(bounds); // Adjust zoom dynamically
      //       return response.result;
      //     }
      //     return null;
      //   })
      // );

      },
      error: (error) => {
        console.error('Failed to get optimization results:', error);
      }
    });
  }

  routing(element:any){
    const routeColor = this.getRandomColor();
    for(var i = 0;i<element.length;i++){
    const url = new URL(element[i].url);
  const params = url.searchParams;

  
  // Extract parameters from the URL
  const originString = params.get('origin');
  const destinationString = params.get('destination');
  const waypointsString = params.get('waypoints');
  const travelMode = params.get('travelmode') || 'driving';
  
  if (!originString || !destinationString) {
    console.error('Origin or destination missing from URL');
    return;
  }
  
  // Parse origin coordinates
  let origin: string | google.maps.LatLng = originString;
  if (originString.includes(',')) {
    const [lat, lng] = originString.split(',').map(coord => parseFloat(coord));
    origin = new google.maps.LatLng(lat, lng);
    // Center the map on the origin
    this.center = { lat, lng };
  }
  
  // Parse destination coordinates
  let destination: string | google.maps.LatLng = destinationString;
  if (destinationString.includes(',')) {
    const [lat, lng] = destinationString.split(',').map(coord => parseFloat(coord));
    destination = new google.maps.LatLng(lat, lng);
  }
  
  // Parse waypoints if they exist
  const waypoints: google.maps.DirectionsWaypoint[] = [];
  if (waypointsString) {
    const waypointsList = waypointsString.split('|');
    
    for (const waypoint of waypointsList) {
      if (waypoint.includes(',')) {
        const [lat, lng] = waypoint.split(',').map(coord => parseFloat(coord));
        waypoints.push({
          location: new google.maps.LatLng(lat, lng),
          stopover: true
        });
      } else {
        waypoints.push({
          location: waypoint,
          stopover: true
        });
      }
    }
  }
  
  // Parse travel mode
  let travelModeEnum: google.maps.TravelMode;
  switch (travelMode.toUpperCase()) {
    case 'DRIVING':
      travelModeEnum = google.maps.TravelMode.DRIVING;
      break;
    case 'WALKING':
      travelModeEnum = google.maps.TravelMode.WALKING;
      break;
    case 'BICYCLING':
      travelModeEnum = google.maps.TravelMode.BICYCLING;
      break;
    case 'TRANSIT':
      travelModeEnum = google.maps.TravelMode.TRANSIT;
      break;
    default:
      travelModeEnum = google.maps.TravelMode.DRIVING;
  }
  
  // Create the directions request
  const request: any = {
    origin,
    destination,
    travelMode: travelModeEnum,
    waypoints: waypoints.length > 0 ? waypoints : undefined,
    optimizeWaypoints: params.get('optimize') === 'true'
  };
  const renderer = new google.maps.DirectionsRenderer({
    map: this.map?.googleMap,
    suppressMarkers: true, // Suppress default markers as we add our own
    polylineOptions: {
      strokeColor: routeColor,
      strokeOpacity: 0.8,
      strokeWeight: 5
    }
  });
  
  // Add to our array to keep reference
  this.directionsRenderers.push(renderer);

  this.directionsService.route(request, (response: any, status: any) => this.ngZone.run(() => {
    if (status == 'OK') {
      console.log(response);
      renderer.setDirections(response);
      this.addRouteLabel(response, routeColor, element[i]);
      // this.bounds = new google.maps.LatLngBounds();
      // this.bounds.union()
    }
  }));
}}


// Helper method to get a random color
getRandomColor(): string {
  return this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
}

// Optional: Add a label for each route
addRouteLabel(response: any, color: string, routeInfo: any) {
  if (response.routes && response.routes.length > 0) {
    const route = response.routes[0];
    if (route.legs && route.legs.length > 0) {
      // Get the middle point of the route for the label
      const leg = route.legs[0];
      const midIndex = Math.floor(leg.steps.length / 2);
      
      if (leg.steps && leg.steps.length > midIndex) {
        const midStep = leg.steps[midIndex];
        const midPoint = midStep.start_location;
        
        // Create a custom overlay for the route label
        const label = new google.maps.InfoWindow({
          position: midPoint,
          content: `<div style="color:${color};font-weight:bold;padding:3px;">
                    Route ${routeInfo.route_id || ''}
                   </div>`,
          pixelOffset: new google.maps.Size(0, -5)
        });
        
        label.open(this.map?.googleMap);
      }
    }
  }
}
  
  initMap() {
  //   const mapElement = document.getElementById('map');
  // const directionsPanel = document.getElementById('directionsPanel');
  
  // // Make sure the elements exist before proceeding
  // if (!mapElement || !directionsPanel) {
  //   console.error('Map or directions panel element not found');
  //   return; // Exit the function if elements don't exist
  // }
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    var cikupa = new google.maps.LatLng(-6.23639, 106.50833);
    var mapOptions = {
      zoom:7,
      center: cikupa
    }
    this.directionsRenderer.setMap(this?.map?.googleMap);
    // this.directionsRenderer.setPanel(document.getElementById('directionsPanel'));
  }
  
  calcRoute() {
    var start = document.getElementById('start');
    var end = document.getElementById('end');
    var request = {
      origin:start,
      destination:end,
      travelMode: 'DRIVING'
    };
  }

  // First, create a function to add store markers with titles
addStoreMarkers(storeData: any) {
  if (!this.map?.googleMap) return;

  // Define store icon
  const storeIcon = {
    path: 'M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13c0,-3.87 -3.13,-7 -7,-7zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5 2.5,1.12 2.5,2.5 -1.12,2.5 -2.5,2.5z',
    fillColor: '#E53935', // Red color for stores
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#000000',
    scale: 1.5,
    anchor: new google.maps.Point(12, 22)
  };

  // Add a marker for each store
  storeData.stores.forEach((store: any) => {
    const marker = new google.maps.Marker({
      position: { lat: store.location[0], lng: store.location[1] },
      map: this.map?.googleMap,
      title: store.id, // This will show on hover
      icon: storeIcon,
      animation: google.maps.Animation.DROP
    });

    // Add info window with more details
    const infoWindow = new google.maps.InfoWindow({
      content: `<div style="padding: 5px;">
                  <strong>${store.id}</strong><br>
                  Demand: ${store.demand} units
                </div>`
    });

    // Open info window on click
    marker.addListener('click', () => {
      infoWindow.open(this.map?.googleMap, marker);
    });
  });
}
}