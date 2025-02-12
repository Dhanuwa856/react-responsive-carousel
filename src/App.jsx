import React from "react";
import Carousel from "./components/Carousel";
import Img01 from "/img01.jpg";
import Img02 from "/img02.jpg";
import Img03 from "/img03.jpg";
import Img04 from "/img04.jpg";

const App = () => {
  const images = [Img01, Img02, Img03, Img04];

  return (
    <div className="flex items-center justify-center w-full h-screen ">
      <Carousel
        images={images}
        autoSlide={true}
        widthClass="w-full sm:max-w-2xl"
        // arrowButtonBg="bg-purple-600 hover:bg-purple-500"
      />
    </div>
  );
};

export default App;
