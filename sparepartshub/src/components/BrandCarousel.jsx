import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/brandCarousel.css';

// Import brand logos
import hyundai from '../assets/hyundai.png';
import toyota from '../assets/toyota.png';
import suzuki from '../assets/suzuki.png';
import mitsubishi from '../assets/mitsubishi.png';
import isuzu from '../assets/isuzu.png';
import daewoo from '../assets/daewoo.png';
import kia from '../assets/kia.png';
import honda from '../assets/honda.png';

const BrandCarousel = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
        }
      }
    ]
  };

  const brands = [
    { name: 'Hyundai', logo: hyundai },
    { name: 'Toyota', logo: toyota },
    { name: 'Suzuki', logo: suzuki },
    { name: 'Mitsubishi', logo: mitsubishi },
    { name: 'Isuzu', logo: isuzu },
    { name: 'Daewoo', logo: daewoo },
    { name: 'Kia', logo: kia },
    { name: 'Honda', logo: honda }
  ];

  const handleBrandClick = (brandName) => {
    navigate(`/brands/${brandName.toLowerCase()}`);
  };

  return (
    <div className="brand-carousel">
      <Slider {...settings}>
        {brands.map((brand, index) => (
          <div key={index} className="brand-slide" onClick={() => handleBrandClick(brand.name)}>
            <img src={brand.logo} alt={brand.name} className="brand-logo" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BrandCarousel;
