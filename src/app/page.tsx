import Navbar from "~/components/prebuilt/Navbar";
import Chat from "~/components/prebuilt/chat";
import MapProvider from "~/components/prebuilt/map/mapcontext";
import LoadingMap from "~/components/prebuilt/loading";
import dynamic from "next/dynamic";

export const runtime = 'edge'

const DynamicGoogleMapComponent = dynamic(() => import("~/components/prebuilt/map/map"), {
  loading: () => <LoadingMap />,
  ssr: false
});

export default function HomePage() {
  return (
    <main >
      <MapProvider>
        <Navbar />
        <div className="flex flex-col-reverse md:h-[42rem] md:px-10 md:pt-6 md:flex-row">
          <Chat />
          <div className="h-[40vh] w-auto md:h-auto md:w-1/2 md:mb-2 md:ml-7">
             <DynamicGoogleMapComponent />
          </div>     
        </div>
      </MapProvider>
    </main>
  );
}

