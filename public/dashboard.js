const map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json",
  center: [78,20],
  zoom: 4
});

const socket = io();
const markers = {};
let followUser = null;
let manual = false;

map.on("mousedown", ()=>manual=true);

socket.on("locationBroadcast", users => {
  document.getElementById("list").innerHTML = "";
  const bounds = new maplibregl.LngLatBounds();

  for(let id in users){
    const u = users[id];
    const pos = [u.lng,u.lat];

    if(!markers[id]){
      const el = document.createElement("div");
      el.style.background="red"; el.style.width="10px"; el.style.height="10px";
      el.style.borderRadius="50%";

      markers[id]=new maplibregl.Marker(el).setLngLat(pos).addTo(map);
    }else{
      markers[id].setLngLat(pos);
    }

    bounds.extend(pos);

    const div=document.createElement("div");
    div.className="user";
    div.innerText=u.user;
    div.onclick=()=>{
      followUser=id;
      manual=true;
      map.flyTo({center:pos,zoom:16,speed:1.2});
    };
    list.appendChild(div);
  }

  if(!manual && bounds.isEmpty()==false){
    map.fitBounds(bounds,{padding:60});
  }

  if(followUser && users[followUser]){
    map.easeTo({center:[users[followUser].lng,users[followUser].lat],duration:1000});
  }
});
