import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule, MapDirectionsService } from '@angular/google-maps';
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
export class AppComponent implements OnInit {
  title = 'route-optimization';
  optimizationResults: any;
  directionsService: any;
  directionsRenderer: any;
  center: any;
  directionsResults$: any;
  map: any;
  
  constructor(private communicationService: CommunicationService, private mapDirectionsService: MapDirectionsService,private http: HttpClient) {
    this.directionsResults$ = new Observable<google.maps.DirectionsResult|null>();
  }
  
  ngOnInit(): void {
    const requestBody = {
      "central_warehouse": {
        "id": "W1",
        "location": [
          40.7128,
          -74.006
        ]
      },
      "warehouses": [
        {
          "id": "W2",
          "location": [
            40.7282,
            -73.7949
          ],
          "capacity": 10000
        },
        {
          "id": "W3",
          "location": [
            40.6782,
            -73.9442
          ],
          "capacity": 8000
        }
      ],
      "stores": [
        {
          "id": "S1",
          "location": [
            40.7831,
            -73.9712
          ],
          "demand": 200
        },
        {
          "id": "S2",
          "location": [
            40.7484,
            -73.9857
          ],
          "demand": 150
        },
        {
          "id": "S3",
          "location": [
            40.7112,
            -74.0134
          ],
          "demand": 300
        }
      ],
      "orders": [
        {
          "store_id": "S1",
          "volume": 200,
          "weight": 500
        },
        {
          "store_id": "S2",
          "volume": 150,
          "weight": 400
        },
        {
          "store_id": "S3",
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
    
    this.communicationService.getOptimizationResults(requestBody).subscribe({
      next: (response) => {
        var res = JSON.parse(response.body);
        console.log('Optimization results:', response);
        this.optimizationResults = response;
        const url = new URL(res.maps_urls.direct_routes[0].url);
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
      const request: google.maps.DirectionsRequest = {
        origin,
        destination,
        travelMode: travelModeEnum,
        waypoints: waypoints.length > 0 ? waypoints : undefined,
        optimizeWaypoints: params.get('optimize') === 'true'
      };
      console.log("Request object:", request);
      console.log(google.maps);
      const url2 = `https://maps.googleapis.com/maps/api/directions/json?origin=New+York,NY&destination=Los+Angeles,CA&key=AIzaSyDdFVzDbj97kwGfXimf8rq9H9Uw-qCcuqs`;
  
      this.http.get(url2).subscribe(
        data => console.log("Directions API Response:", data),
        error => console.error("Error fetching directions:", error)
      );
      // Request directions and update the map
      this.directionsResults$ = this.mapDirectionsService.route(request).pipe(
        tap({
          next: response => console.log("Response received:", response),
          error: err => console.error("Error fetching directions:", err)
        }),
        map(response => {
          if (response.result && response.result.routes) { // Ensure result is present
            const bounds = new google.maps.LatLngBounds();
            response.result.routes[0].legs.forEach(leg => {
              bounds.extend(leg.start_location);
              bounds.extend(leg.end_location);
            });
            this.map.fitBounds(bounds); // Adjust zoom dynamically
            return response.result;
          }
          return null;
        })
      );

      },
      error: (error) => {
        console.error('Failed to get optimization results:', error);
      }
    });
  }


  
  initMap() {
    const mapElement = document.getElementById('map');
  const directionsPanel = document.getElementById('directionsPanel');
  
  // Make sure the elements exist before proceeding
  if (!mapElement || !directionsPanel) {
    console.error('Map or directions panel element not found');
    return; // Exit the function if elements don't exist
  }
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    var chicago = new google.maps.LatLng(41.850033, -87.6500523);
    var mapOptions = {
      zoom:7,
      center: chicago
    }
    this.map = new google.maps.Map(mapElement, mapOptions);
    this.directionsRenderer.setMap(map);
    this.directionsRenderer.setPanel(document.getElementById('directionsPanel'));
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
}