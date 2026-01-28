const map = new maplibregl.Map({
  container:"map",
  style:"https://demotiles.maplibre.org/style.json",
  center:[78,20],
  zoom:5
});

const socket = io();
const markers = {};
let follow = null;
let manual = false;

map.on("wheel",()=>manual=true);
map.on("mousedown",()=>manual=true);

function smoothMove(marker, from, to){
  let start=null;
  function step(t){
    if(!start) start=t;
    const p=Math.min((t-start)/1000,1);
    const lng=from[0]+(to[0]-from[0])*p;
    const lat=from[1]+(to[1]-from[1])*p;
    marker.setLngLat([lng,lat]);
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

socket.on("locationBroadcast", users=>{
  list.innerHTML="";
  const bounds=new maplibregl.LngLatBounds();

  for(let id in users){
    const u=users[id];
    const pos=[u.lng,u.lat];

    if(!markers[id]){
      markers[id]=new maplibregl.Marker().setLngLat(pos).addTo(map);
    }else{
      smoothMove(markers[id], markers[id].getLngLat().toArray(), pos);
    }

    bounds.extend(pos);

    const d=document.createElement("div");
    d.className="user";
    d.innerText=u.user;
    d.onclick=()=>{
      follow=id;
      manual=true;
      map.flyTo({center:pos,zoom:16});
    };
    list.appendChild(d);
  }

  if(!manual && !bounds.isEmpty()){
    map.fitBounds(bounds,{padding:60});
  }

  if(follow && users[follow]){
    map.easeTo({center:[users[follow].lng,users[follow].lat],duration:1000});
  }
});
