import Navbar from "~/components/prebuilt/Navbar";
import Chat from "~/components/prebuilt/chat";
import GoogleMapComponent from "~/components/prebuilt/map/map";
import MapProvider from "~/components/prebuilt/map/mapcontext";

export const runtime = 'edge'

export default function HomePage() {
  return (
    <main >
      <MapProvider>
        <Navbar />
        <div className="flex flex-col-reverse md:h-[42rem] md:px-10 md:pt-6 md:flex-row">
          <Chat />
          <div className="h-[40vh] w-auto md:h-auto md:w-1/2 md:mb-2 md:ml-7">
            <GoogleMapComponent/>
          </div>     
        </div>
      </MapProvider>
    </main>
  );
}
