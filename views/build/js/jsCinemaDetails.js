goongjs.accessToken = 'sEWmdGHz9T3IEP2ND6KlMMX9QMgPGjjHHOpofqCT';

var map = new goongjs.Map({
    container: 'map',
    style: 'https://tiles.goong.io/assets/goong_map_web.json', // stylesheet location
    center: [106.67783681139827, 10.738047815253331], // starting position [lng, lat]
    zoom: 17// starting zoom
});


map.jumpTo({
    center: [$('#inputLng').val(), $("#inputLat").val()],
    zoom: 17
})

var marker = new goongjs.Marker()
    .setLngLat([$('#inputLng').val(), $("#inputLat").val()])
    .addTo(map);

map.stop();



