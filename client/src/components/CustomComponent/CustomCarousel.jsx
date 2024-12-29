
import { useNavigate } from 'react-router-dom';
import {  Button } from "flowbite-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CustomCarousel = () => {

  
  const navigate = useNavigate();

  const settings = {
    dots: false,
    speed: 100,
    slidesToShow: 8,
    slidesToScroll: 2,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 1000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }
    ]
  };

  const category = ["LifeStyle", "React", "Java", "DSA", "System", "Design",  "Programming", "Science", "Technology", "News", "Jobs", "Informative", "Entertainment", "Products", "Maths"];

  const searchByTag = (e) =>{
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', e);
    urlParams.set('sort', null);
    urlParams.set('category', e);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
    console.log(e)
  }

  return (
    <div className="w-full mt-2" style={{ position: 'relative'}}>
     <Slider {...settings}>
     {category.map((slide) => (
      <>
        <div className="mx-1" key={slide}>
          <Button   color="gray" value={slide} className='w-full cursor-pointer' 
             onClick={()=>searchByTag(slide.toLowerCase())}>
            {slide}
           </Button>
      </div>
      </>

        ))}
        
      </Slider>

      
    </div>
  );
};

export default CustomCarousel;
