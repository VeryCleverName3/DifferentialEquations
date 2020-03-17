var oldMode = false;

var particles = false;

var color = true;



var c = document.getElementById("canvas");

var scale = 2;

c.style.width = c.style.height = window.innerHeight + "px";

var s = c.height = c.width = scale * window.innerHeight;

var ctx = c.getContext("2d");

var diffEQ = "(x)-(y)";

var size = 10;

var speed = size * 0.001;

var points = [];

var mouseDown = false;

var mx;

var my;

function getXAndY(s, point, lastSlope){
    var ans = {x: 0, y: 0};

    if(((s > 0 && s < 1) && (lastSlope < 0 && lastSlope > -1)) || ((s < 0 && s > -1) && (lastSlope > 0 && lastSlope < 1))){
        point.dir *= -1;
    }

    ans.y = point.dir * Math.sqrt(speed / ((1/(s*s))+1));
    ans.x = ans.y / s;

    return ans;
}

function update(){
    if(particles) ctx.clearRect(0, 0, c.height, c.height);
    for(var i = 0; i < points.length; i++){
        var slope = eval(keepReplacing(keepReplacing(diffEQ, "x", points[i].x), "y", points[i].y));
        var brightnessAdd = 0;

        var vector = getXAndY(slope, points[i], points[i].lastSlope);

        angle = Math.atan2(vector.y, vector.x) * 360 / Math.PI;

        //console.log(brightnessAdd);
        ctx.fillStyle = "hsl("+ angle + ", 100%, " + (50) + "%)";
        if(!color){
            ctx.fillStyle = "black";
        }
        //ctx.fillRect((s * (((points[i].x / size) + 1) / 2)) - 5, (s - (s * (((points[i].y / size) + 1) / 2))) - 5, 10, 10);
        ctx.beginPath();
        ctx.arc((s * (((points[i].x / size) + 1) / 2)), s - (s * (((points[i].y / size) + 1) / 2)), 10, 0, 2 * Math.PI);
        ctx.fill();
        if(oldMode){
            points[i].x += speed;
            points[i].y += slope * speed;
        } else {
            points[i].x += vector.x;
            points[i].y += vector.y;
        }

        points[i].lastSlope = slope;
        
        if((oldMode && points[i].x > size) ||(!oldMode && (points[i].x > size || points[i].x < -size || points[i].y > size || points[i].y < -size))){
            points.splice(i, 1);
        }
    }
}

function addPoint(x, y){
    points.push({x:x, y:y, dir: 1, lastSlope: NaN});
    points.push({x:x, y:y, dir: -1, lastSlope: NaN})
}

onmousedown = (e)=>{
    mx = e.clientX * scale;
    mx /= s;
    mx *= 2;
    mx -= 1;
    my = e.clientY * scale;
    my = s - my;
    my /= s;
    my *= 2;
    my -= 1;
    addPoint(size * mx, size * my);
    mouseDown = true;
}
onmouseup = (e)=>{mouseDown = false;}

onmousemove = (e)=>{
    mx = e.clientX * scale;
    mx /= s;
    mx *= 2;
    mx -= 1;
    my = e.clientY * scale;
    my = s - my;
    my /= s;
    my *= 2;
    my -= 1;
}

setInterval(()=>{if(mouseDown)addPoint(size * mx, size * my);}, 50)

setInterval(update, 1000/60);

function keepReplacing(a, b, c){
    var temp = a;
    while(temp != temp.replace(b, c)) temp = temp.replace(b, c);

    return temp;
}

function fill(){
    fillX = -1;
    fillY = -1;
    while(fillOnce()){}
    update();
    points = [];
}

var fillX = -1;
var fillY = -1;

function fillOnce(){
    fillY += 0.01;
    if(fillY >= 1){
        fillY = -1;
        fillX += 0.01;
    }

    if(fillX >= 1){
        return false;
    }

    addPoint(fillX * size, fillY * size);

    return true;
}

function toggleOldMode(){
    oldMode = !oldMode;
    speed = (0.001 + (0.009 * oldMode)) * size
}

function toggleColor(){
    color = !color;
}

function toggleParticles(){
    particles = !particles;
}