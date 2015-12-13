// (function() {
//   var canvas = document.getElementById('canvasHeader');
//   var ctx = canvas.getContext('2d');
//   window.addEventListener('resize', draw(), false);
//   window.requestAnimationFrame(draw);
//
//   function draw() {
//     canvas.width = window.innerWidth;
//     console.log('draw!');
//     ctx.globalCompositeOperation = 'destination-over';
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     ctx.fillStyle = 'rgba(0,0,0,1)';
//     ctx.fillRect(0,0,canvas.width,canvas.height);
//     ctx.save();
//     ctx.beginPath();
//     ctx.moveTo(100, 20);
//     ctx.fillStyle = 'rgba(184,200,190)';
//     ctx.fillRect(0, 0, 50, 24); // Shadow
//     window.requestAnimationFrame(draw);
//   }
// })();
