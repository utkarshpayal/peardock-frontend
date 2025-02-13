function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source
          src="https://cdn.pixabay.com/video/2023/08/15/176072-854875280_tiny.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
        <h1 className="max-w-[800px] text-7xl font-bold text-white">
          Best Cost Performance
        </h1>
        <h1 className="max-w-[600px] text-6xl font-bold text-transparent bg-gradient-to-r from-red-400 to-blue-400 bg-clip-text">
          Reduce AI Costs with Decentralized GPUs
        </h1>
      </div>
    </div>
  );
}

export default Home;
