import React, { useState, useEffect, useRef } from "react";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const Carousel = ({
  // Array of images. Each item can be a string (image URL) or an object { url, alt }
  images = [],
  // Enable automatic sliding (default is true)
  autoSlide = true,
  // Auto slide interval in milliseconds (default is 3000ms)
  autoSlideInterval = 3000,
  // Customizable Tailwind CSS classes for width and height
  widthClass = "w-full", // Default width (full width)
  heightClass = "h-100", // Default height (adjust as needed)
  // Customizable arrow button colors
  arrowButtonBg = "bg-gray-700 bg-opacity-50",
  arrowButtonIconColor = "text-white",
  arrowButtonHoverBg = "hover:bg-opacity-75",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Set container width on mount and update on resize
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto slide effect
  useEffect(() => {
    if (!autoSlide || images.length === 0) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, autoSlideInterval);
    return () => clearInterval(intervalId);
  }, [autoSlide, autoSlideInterval, images.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Drag handlers
  const handleDragStart = (e) => {
    setIsDragging(true);
    if (e.type === "mousedown") {
      setDragStartX(e.clientX);
    } else if (e.type === "touchstart") {
      setDragStartX(e.touches[0].clientX);
    }
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    let currentX = 0;
    if (e.type === "mousemove") {
      currentX = e.clientX;
    } else if (e.type === "touchmove") {
      currentX = e.touches[0].clientX;
    }
    setDragOffset(currentX - dragStartX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    const threshold = containerWidth / 4; // slide change threshold (25% of container width)
    if (dragOffset > threshold && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (dragOffset < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
    setIsDragging(false);
    setDragOffset(0);
  };

  // Calculate the drag offset as a percentage of the container width
  const dragPercentage = containerWidth
    ? (dragOffset / containerWidth) * 100
    : 0;
  // Remove transition when dragging for real-time update; otherwise animate the slide change.
  const transitionStyle = isDragging ? "none" : "transform 0.7s ease-in-out";

  return (
    <div
      ref={containerRef}
      className={`relative ${widthClass} ${heightClass} mx-auto overflow-hidden select-none container`}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
    >
      {/* Slide Container */}
      <div
        className="flex"
        style={{
          transform: `translateX(calc(-${
            currentIndex * 100
          }% + ${dragPercentage}%))`,
          transition: transitionStyle,
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className={`flex-shrink-0 ${widthClass} ${heightClass}`}
          >
            <img
              src={typeof img === "string" ? img : img.url}
              alt={
                typeof img === "string"
                  ? `Slide ${index + 1}`
                  : img.alt || `Slide ${index + 1}`
              }
              className="object-cover w-full h-full cursor-grab"
              draggable="false"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute top-1/2 left-4 transform -translate-y-1/2 ${arrowButtonBg} ${arrowButtonIconColor} p-2 rounded-full ${arrowButtonHoverBg} focus:outline-none cursor-pointer duration-1000`}
      >
        <MdKeyboardDoubleArrowLeft />
      </button>
      <button
        onClick={nextSlide}
        className={`absolute top-1/2 right-4 transform -translate-y-1/2 ${arrowButtonBg} ${arrowButtonIconColor} p-2 rounded-full ${arrowButtonHoverBg} focus:outline-none cursor-pointer duration-1000`}
      >
        <MdKeyboardDoubleArrowRight />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full ${
              currentIndex === index ? "bg-white" : "bg-gray-500"
            } focus:outline-none cursor-pointer`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
