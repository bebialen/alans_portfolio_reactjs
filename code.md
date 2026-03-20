Right: 3D Scene (Fixed)
      <div
        className="hidden lg:block lg:w-[20%] lg:h-full relative bg-[#050505] border-l border-white/5 cursor-crosshair"
        onMouseDown={handleDoubleTap}
      >
        {/* <div className="absolute top-8 left-8 z-2 hidden lg:block">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className={`w-2 h-2 ${activeSection === 'locked' ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {activeSection === 'locked' ? 'Locked' : `Sync: ${activeSection.toUpperCase()}`}
            </span>
          </div>
        </div> */}
        <button
  onClick={() => setIsExpanded(true)}
  className="absolute top-6 right-6 
             bg-white/10 backdrop-blur 
             p-1 rounded-xl text-white 
             hover:bg-white/20 
             transition-all duration-300"
>
  <Maximize2 className="w-2 h-2" />
</button>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none"></div>


        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          {/* @ts-ignore */}
          <ambientLight intensity={0.4} />
          {/* @ts-ignore */}
          <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
          {/* @ts-ignore */}
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="night" />

          <Suspense fallback={null}>
            <PhoneModel onAppChange={() => { }} activeSection={activeSection} />
          </Suspense>

          <ContactShadows
            position={[0, -4.5, 0]}
            opacity={0.3}
            scale={15}
            blur={2.5}
            far={10}
          />

          <OrbitControls
            enabled={canRotate}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
        

        <div className="absolute bottom-5 left-10 right-10 flex flex-col items-center pointer-events-none">
          <div className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${canRotate ? 'opacity-30' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <Rotate3d className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <p className="text-[5px] font-black text-white uppercase tracking-[0.2em]">Double tap to rotate iphone frame</p>
            </div>
            {canRotate && (
              <p className="text-zinc-500 text-[6px] font-black uppercase tracking-widest">Rotation Unlocked • Double tap to lock</p>
            )}
          </div>
        </div>
      </div>