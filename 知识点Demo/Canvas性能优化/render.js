// Worker 线程：使用 OffscreenCanvas 绘制重负载内容
onmessage = (e) => {
  const { canvas, width, height } = e.data;
  const ctx = canvas.getContext('2d');
  let t = 0;
  function heavyDraw(){
    ctx.clearRect(0,0,width,height);
    for(let i=0;i<12000;i++){
      const x = Math.random()*width;
      const y = Math.random()*height;
      ctx.fillStyle = `hsl(${(t+i)%360},70%,60%)`;
      ctx.fillRect(x,y,2,2);
    }
    t+=1;
    postMessage('后台渲染中...');
    self.requestAnimationFrame(heavyDraw);
  }
  heavyDraw();
};