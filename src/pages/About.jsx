import React from "react";
import founderImg from "../assets/images/founder.jpg"; // replace with your founder's image path

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-6">
        About the brand
      </h1>

      {/* Brand Mission */}
      <p className="text-gray-700 text-lg text-center mb-10 leading-relaxed">
        At <span className="font-semibold">Dara Hair and Extensions</span>, we
        believe every woman deserves to feel confident and beautiful. Our
        mission is to provide{" "}
        <span className="text-pink-600">
          affordable, high-quality wigs, hair bundles, and care products
        </span>{" "}
        that blend style, durability, and comfort.
      </p>

      {/* Story / Values */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-12">
        <p className="text-gray-600 leading-relaxed">
          From ready-made wigs to premium hair care essentials, our collections
          are carefully selected to meet the needs of every customer. Whether
          you’re looking for a natural everyday look or a bold statement piece,
          Dara Hair is your trusted beauty partner.
          <br />
          <br />
          We pride ourselves on excellent customer service, fast delivery, and
          products that inspire confidence. With us, beauty goes beyond hair —
          it’s about empowering you to look and feel your best.
        </p>
      </div>

      {/* Founder Section */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Image */}
        <div className="w-full md:w-1/3 flex justify-center">
          <img
  src={founderImg}
  alt="Founder"
  className="w-72 h-72 object-contain rounded-full shadow-lg border-4 border-pink-500 bg-white"
/>


        </div>

        {/* Text */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Meet Our Founder
          </h2>
          <p className="text-gray-600 leading-relaxed">
            <span className="font-semibold">Dara</span> started this brand with
            a vision to make quality hair accessible to every woman without
            compromising on style or comfort. With a passion for beauty and a
            commitment to excellence, she has grown Dara Hair into a trusted
            name that stands for confidence, empowerment, and elegance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
