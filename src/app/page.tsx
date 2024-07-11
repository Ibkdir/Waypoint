import Navbar from "~/components/prebuilt/Navbar";
import Chat from "~/components/prebuilt/chat";
import GoogleMapComponent from "~/components/prebuilt/map/map";
import MapProvider from "~/components/prebuilt/map/mapcontext";

export default function HomePage() {
  return (
    <main>
      <MapProvider>
        <Navbar />
        <div className="flex h-custom px-10 pt-6">
          <Chat />
          <div className="h-auto w-6/12 pb-2 pl-7">
            <GoogleMapComponent />
          </div>     
        </div>
      </MapProvider>
    </main>
  );
}
