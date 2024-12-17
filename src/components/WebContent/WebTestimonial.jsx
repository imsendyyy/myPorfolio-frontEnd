import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import config from "../config";
import Loading from "../Admin/Loading";

const WebTestimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false)

  const fatchAllTestimonials = async() => {
    setLoading(true)
    try {
        const res = await axios.get(`${config.API_URL}testimonial/getAllTestimonials`)
        setTestimonials(res.data)
    } catch (error) {
        console.log(error)
    } finally{
        setLoading(false)
    }
  }

  // Fetch data from API
  useEffect(() => {
    fatchAllTestimonials();
  }, []);

  // Slick Carousel Settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  if(loading){
    return ( <Loading/>)
  }

  return (
    <section id="testimonials">
<div className=" bg-gray-100 text-gray-800 py-12 px-6">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Testimonials</h2>

      <div className="max-w-4xl mx-auto">
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div
            key={index}
            className="bg-white shadow-md rounded-lg p-8 flex flex-col items-center text-center"
          >
            <div className="flex justify-center items-center m-auto w-36 h-36 rounded-full bg-gray-200 mb-4 overflow-hidden">
              <img
                src={testimonial.imageUrl || "https://via.placeholder.com/150"}
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold">{testimonial.name}</h3>
            <p className="text-sm text-gray-500">{testimonial.designation} at {testimonial.company}</p>
            <div className="flex items-center justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < testimonial.rating ? "text-yellow-500" : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-600 mt-4">" {testimonial.feedback} "</p>
          </div>
          
          ))}
        </Slider>
      </div>
    </div>
    </section>
    
  );
};

export default WebTestimonial;
