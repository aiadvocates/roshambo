import Head from "next/head";
import Navigation from "~/components/layout/navigation"
import Footer from "~/components/layout/footer"

export default function Theme() {
  return (
    <article>
      <Navigation />
      <div className="px-6 py-20 bg-white lg:px-8 lg:py-32">
        <div className="grid max-w-screen-xl grid-cols-2 gap-8 mx-auto lg:gap-24 xl:gap-32 md:items-center">
          <div className="flex flex-row col-span-2 space-x-2 md:col-span-1">
            <img
              src="/images/minimal/xps-g2E2NQ5SWSU-unsplash.jpg"
              alt="image placeholder"
              className="rounded-lg sahdow-lg md:shadow-2xl"
            />
          </div>
          <div className="col-span-2 md:col-span-1">
            <h2 className="mb-6 text-2xl font-medium text-gray-800 sm:text-3xl lg:text-4xl lg:mb-8">
              So if on advanced addition absolute received replying
            </h2>
            <p className="text-xl text-gray-700 lg:text-2xl">
              When, while the lovely valley teems with vapour around me, and the
              meridian sun strikes the waiting be females upper surface of the
              impenetrable foliage of my trees
            </p>
          </div>
        </div>
      </div>
      <div className="px-6 py-20 bg-gray-100 lg:px-8 lg:py-32">
        <div className="grid max-w-screen-xl grid-cols-2 gap-8 mx-auto lg:gap-24 xl:gap-32 md:items-center">
          <div className="flex flex-row order-1 col-span-2 space-x-2 md:col-span-1 md:order-2">
            <img
              src="/images/minimal/adomas-aleno-4vrZpOo7fTc-unsplash.jpg"
              alt="image placeholder"
              className="rounded-lg sahdow-lg md:shadow-2xl"
            />
          </div>
          <div className="order-2 col-span-2 md:col-span-1 md:order-1">
            <h2 className="mb-6 text-2xl font-medium text-gray-800 sm:text-3xl lg:text-4xl lg:mb-8">
              So if on advanced addition absolute received replying
            </h2>
            <p className="text-xl text-gray-700 lg:text-2xl">
              When, while the lovely valley teems with vapour around me, and the
              meridian sun strikes the waiting be females upper surface of the
              impenetrable foliage of my trees
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </article>
  );
}
