//Location data
var initialData = [
    {
    title: "Overland Park Arboretum and Botanical Gardens",
    lat: 38.7978, 
    lng: -94.6910,
    streetAddress: "8909 W 179th St",
    cityAddress: "Overland Park, KS 66013",
    url: "https://artsandrec-op.org/",
    imgSrc: "img/OP_Arboretum.jpg"
    },
    {   
    title: "Oak Park Mall",
    lat: 38.9536, 
    lng: -94.7194,
    streetAddress: "11149 W 95th St",
    cityAddress: "Overland Park, KS 66214",
    url: "http://www.thenewoakparkmall.com/",
    imgSrc: "img/oakpark_mall.jpg"
    },
    {   
    title: "Museum at Prairiefire",
    lat: 38.8819, 
    lng: -94.6521,
    streetAddress: "Nall and 135th Street 5801 W. 135th Street",
    cityAddress: "Overland Park, KS 66223",
    url: "http://www.museumofpf.org/",
    imgSrc: "img/Museum_at_Prairiefire.jpg"
    },
    {   
    title: "Topgolf",
    lat: 38.9366, 
    lng: -94.6482,
    streetAddress: "10611 Nall Ave",
    cityAddress: "Overland Park, KS 66207",
    url: "https://topgolf.com/us/overland-park/pricing/",
    imgSrc: "img/top-golf.jpg"
    },
    {
    title: "iFLY Indoor Skydiving",
    lat: 38.9303, 
    lng: -94.6663,
    streetAddress: "10975 Metcalf Ave",
    cityAddress: "Overland Park, KS 66210",
    url: "https://www.iflyworld.com/kansas-city/",
    imgSrc: "img/ifly.jpg"
    },
    {   
    title: "New Theatre Restaurant",
    lat: 38.9617, 
    lng: -94.6706,
    streetAddress: "9229 Foster",
    cityAddress: "Overland Park, KS 66212",
    url: "http://www.newtheatre.com/",
    imgSrc: "img/new-theater.jpg"
    },
    {
    title: "Johnson County Museum",
    lat: 38.9691, 
    lng: -94.6686,
    streetAddress: "8788 Metcalf Ave",
    cityAddress: "Overland Park, KS 66212",
    url: "https://www.jocogov.org/dept/museum/home",
    imgSrc: "img/Johnson_County_Museum.jpg"
    },
    {
    title: "Cinetopia Overland Park",
    lat: 38.8825, 
    lng: -94.6515,
    streetAddress: "5724 W 136th Terrace",
    cityAddress: "Overland Park, KS 66223",
    url: "http://cinetopia.com/",
    imgSrc: "img/Cinetopia.jpg"
    },
    {
    title: "Escape KC",
    lat: 39.1082, 
    lng: -94.5904,
    streetAddress: "7223 W 95th St #300",
    cityAddress: "Overland Park, KS 66212",
    url: "https://escape-kc.com/",
    imgSrc: "img/escape-room.jpg"
    }   
];


var initMap = function(){
    //Creates a new map, centers and zooms to given position and zoom level
     map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.905672, lng: -94.6843605},
     zoom: 10
    });
 ko.applyBindings(new ViewModel());
}

var ViewModel = function(){ 
    var self = this;
    //Input from dropdow list search field
    this.searchInput = ko.observable("");
    this.markerList = ko.observableArray([]);
    
    initialData.forEach(function(markerItem){
       self.markerList.push(new marker(markerItem));
    });
    
    //Filters the dropdown list and markers on map according to the input query from search input.
    this.searchFilter = ko.computed(function(){
        var searchOutput = [];
        for(var i=0;i<self.markerList().length;i++){
            //Compares the search input with the dropdown list data based on namse of the location
            if(self.markerList()[i].title.toLowerCase().includes(this.searchInput().toLowerCase())){
                //All the dropdown list items that mathc the input query are stored and returned using search output array 
                //Similarly markers visiblilty
                searchOutput.push(self.markerList()[i]);
                this.markerList()[i].mapMarker.setVisible(true);    
            }else{
                this.markerList()[i].mapMarker.setVisible(false);
            }
        }
        return searchOutput;
    },this);
}


var marker = function(data){
    var self = this;
    this.title = data.title;
    this.latitude = data.lat;
    this.longitude = data.lng;
    this.streetAddress = data.streetAddress;
    this.cityAddress = data.cityAddress;
    this.url = data.url;
    this.imgSrc = data.imgSrc;
    this.markers = [];
    
    //creates info window
    infowindow = new google.maps.InfoWindow();
    
    //marker setup
    this.mapMarker = new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        map: map,
        animation: google.maps.Animation.DROP,
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        title: data.title,
        image: this.imgSrc,
        url: this.url,
        lat:data.lat,
        lng:data.lng,
        streetAddress: this.streetAddress,
        cityAddress: this.cityAddress
    });
    
    //Clicking a maker populates its info window with data
    this.mapMarker.addListener('click', function(){
        populateInfoWindow(this, infowindow);
    });
    
    //chages the color of maps marker when mouseover
    this.mapMarker.addListener('mouseover', function() {
        this.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');
    });
    
    //Default color of maps marker
    this.mapMarker.addListener('mouseout', function() {
        this.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
    });  
    
    //Opens info window when user clicks a particular marker or selects location from dropdown list
    this.showMarker = function(){
        google.maps.event.trigger(self.mapMarker, 'click'); 
    };
        
}

function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ 
              marker.setAnimation(null); 
          }, 1500);
        }
      }

function populateInfoWindow(marker, infowindow){
    if(infowindow.marker != marker){
        infowindow.setContent('');
        infowindow.marker = marker;
        toggleBounce(marker);
        //Centers map to particular clicked marker
        map.setCenter(marker.position);
        
        //Foursquare Api url
       var foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll='+ marker.lat + ',' + marker.lng + '&client_id=NNG1LS3XJRMEGJXEF051RRI01PDKBSIU2CB3C5U3OT4GXHKI&client_secret=T20LIPBS3T4M0BQH5VFWRN3QX2CP12IHZVNVRAW5DDVHD0RZ&v=20171225';
    
        //Retrives data from foursquare api using given url
        //Outputs result based on input query
        $.getJSON(foursquareURL).done(function(data) {
		var results = data.response.venues[0];
        self.category=  results.categories[0].shortName;
            
        //Populates info window with initial data and api output
        infowindow.setContent('<div class="title"><strong>'+ marker.title+'</strong><div>' + '<br><img height="100" width = "200" src="'+marker.image+'"/>'+'<br><div>'+marker.streetAddress+', <br>'+marker.cityAddress+'</div>'+'<a href="'+marker.url+'">'+marker.url+'</a>'+'<div><p>Category: '+self.category+'</p></div>');
	   }).fail(function() {
        //alerts users if any error occurs with foursquare api
		alert("Error with Foursquare API call. Plese try refreshing");
	   });
        
        infowindow.open(map, marker);
        //Closes info window on clicking 'x' mark
        infowindow.addListener('closeclick', function(){
            infowindow.marker = null;
        });
        
    }
}

function mapsErrorHandling(){
    alert("Error loading Google Maps. Please try reloading the page and check your internet connection");
}
