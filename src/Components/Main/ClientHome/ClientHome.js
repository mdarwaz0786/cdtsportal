import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView, Text, StyleSheet, Image, Dimensions, Linking, TouchableOpacity } from "react-native";
const { width } = Dimensions.get("window");

const ClientHome = () => {
  const banners = [
    { id: "1", image: require("../../../Assets/banner1.png") },
    { id: "2", image: require("../../../Assets/banner2.png") },
    { id: "3", image: require("../../../Assets/banner3.png") },
    { id: "4", image: require("../../../Assets/banner4.png") },
  ];

  const extendedBanners = [...banners, banners[0]];
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        let nextSlide = prev + 1;
        if (nextSlide === extendedBanners.length) {
          scrollRef.current?.scrollTo({ x: 0, animated: false });
          return 0;
        } else {
          scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
          return nextSlide;
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [activeSlide]);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    if (slideIndex === extendedBanners.length - 1) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: 0, animated: false });
      }, 300);
      setActiveSlide(0);
    } else {
      setActiveSlide(slideIndex);
    };
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@codediffusion.in');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+91-7827114607');
  };

  const handleWebsitePress = () => {
    Linking.openURL('https://www.codediffusion.in');
  };

  const url = "https://www.google.com/maps/place/Code+Diffusion+-+Mobile+Application+Development+Company+in+Delhi/@28.6290378,77.0703847,2542m/data=!3m3!1e3!4b1!5s0x396421a66a15b5f7:0x171170d419f52b5f!4m6!3m5!1s0x390d053a2359d897:0x7ade773a38d4c83d!8m2!3d28.6290194!4d77.0806845!16s%2Fg%2F11c2p478_s?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D";

  const openGoogleMaps = () => {
    Linking.openURL(url);
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={styles.carouselContainer}
        >
          {extendedBanners.map((item, index) => (
            <View key={index} style={styles.carouselItem}>
              <Image source={item.image} style={styles.carouselImage} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.mainSection}>
          {/* About Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Who We Are</Text>
            <Text style={styles.sectionText}>
              At Code Diffusion Technologies we specialize in creating innovative and high-quality digital solutions for businesses of all sizes. Our team of skilled developers, designers, and consultants work tirelessly to build secure, scalable, and user-friendly websites and mobile apps. We are committed to bringing your vision to life by integrating the latest technologies with a customer-first approach.
            </Text>
          </View>

          {/* Services */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <Text style={styles.sectionText}>
              We offer a wide range of IT services that cater to various business needs:
            </Text>
            <Text style={styles.sectionText}>✔ Custom Website Development: Tailored solutions that align with your business goals and user needs.</Text>
            <Text style={styles.sectionText}>✔ Mobile App Development (iOS & Android): Cutting-edge apps that provide exceptional user experiences.</Text>
            <Text style={styles.sectionText}>✔ UI/UX Design & Branding: Stunning designs that elevate your brand’s presence and user engagement.</Text>
            <Text style={styles.sectionText}>✔ Cloud & Backend Solutions: Reliable, scalable cloud services and secure backend infrastructure for your applications.</Text>
            <Text style={styles.sectionText}>✔ Digital Marketing & SEO: Helping businesses increase their online visibility and attract more customers.</Text>
            <Text style={styles.sectionText}>✔ Graphic Designing: Creative designs that capture your brand’s essence and attract your target audience.</Text>
            <Text style={styles.sectionText}>✔ Industrial Training: Practical and industry-focused training programs to help professionals and students gain hands-on experience and enhance their skills.</Text>
          </View>

          {/* Why Choose Us */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Why Choose Us?</Text>
            <Text style={styles.sectionText}>🚀 Expertise in the latest technologies such as React, Next.js, Node.js, MongoDB and Cloud Services.</Text>
            <Text style={styles.sectionText}>🔒 We ensure the highest level of security, scalability, and performance for all our solutions.</Text>
            <Text style={styles.sectionText}>💡 A customer-centric approach that helps deliver tailored solutions to meet specific business objectives.</Text>
            <Text style={styles.sectionText}>🕒 24/7 Support & Maintenance: We offer continuous support to ensure your applications run smoothly.</Text>
            <Text style={styles.sectionText}>💼 Proven track record of delivering successful projects for various industries, including eCommerce, healthcare, finance, and more.</Text>
          </View>

          {/* Portfolio */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Portfolio</Text>
            <Text style={styles.sectionText}>
              Our portfolio highlights innovative and high-performance applications across various domains:
            </Text>

            <Text style={styles.sectionText}>
              ✅ E-commerce Platforms: Custom-built solutions powering seamless shopping experiences for global online stores.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Enterprise Management Solutions: Scalable, high-performance systems for efficiently managing large organizations.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Social Media Applications: Interactive and engaging platforms connecting millions of users worldwide.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Healthcare & Finance Applications: Secure, HIPAA-compliant, and FinTech solutions ensuring privacy and reliability.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Real-time Streaming Platforms: High-performance video and audio streaming apps for entertainment, sports, and education.
            </Text>
            <Text style={styles.sectionText}>
              ✅ AI-powered Chatbots & Automation: Intelligent automation solutions enhancing customer engagement and support.
            </Text>
            <Text style={styles.sectionText}>
              ✅ SaaS Applications: Cloud-based software solutions optimized for performance, security, and scalability.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Ticket Booking & Reservation Systems: Robust platforms for booking flights, hotels, events, and movie tickets in real-time.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Logistics & Supply Chain Management: Advanced solutions for tracking shipments, fleet management, and inventory optimization.
            </Text>
            <Text style={styles.sectionText}>
              ✅ EdTech Platforms: Interactive e-learning solutions with live classes, quizzes, and AI-driven personalized learning.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Cryptocurrency & Blockchain Solutions: Secure platforms for trading, decentralized finance (DeFi), and smart contract development.
            </Text>
            <Text style={styles.sectionText}>
              ✅ IoT-based Smart Applications: Connected device solutions for home automation, smart cities, and industrial monitoring.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Ride-sharing & Transportation Platforms: Scalable applications for cab booking, carpooling, and fleet management.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Food Delivery & Restaurant Management: On-demand food ordering apps and restaurant POS systems with real-time tracking.
            </Text>
            <Text style={styles.sectionText}>
              ✅ HR & Payroll Management Systems: Automated tools for recruitment, employee management, and payroll processing.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Cybersecurity & Authentication Systems: Secure authentication solutions including MFA, biometric verification, and encrypted communications.
            </Text>
            <Text style={styles.sectionText}>
              ✅ Custom ERP & CRM Solutions: Integrated tools to streamline business operations, customer management, and sales tracking.
            </Text>
          </View>

          {/* Testimonials */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What Our Clients Say</Text>

            <Text style={styles.sectionText}>
              "The team at Code Diffusion Technologies went above and beyond to deliver an outstanding product. Their dedication, attention to detail, and expertise made all the difference. Our project was a huge success, and we couldn't be more grateful for their hard work!" - <Text style={{ fontWeight: "500", color: "#333" }}>Parach Desai</Text>
            </Text>

            <Text style={styles.sectionText}>
              "Working with Code Diffusion Technologies has been an absolute game-changer for our business. From concept to execution, they brought innovative ideas to life and executed them flawlessly. We look forward to more collaborations in the future!" - <Text style={{ fontWeight: "500", color: "#333" }}>Ashutosh Ojha</Text>
            </Text>

            <Text style={styles.sectionText}>
              "We have partnered with many agencies in the past, but Code Diffusion Technologies stands out in terms of professionalism, creativity, and reliability. Their team delivered exceptional results on time and within budget. Highly recommended!" - <Text style={{ fontWeight: "500", color: "#333" }}>Yadav Himanshu</Text>
            </Text>
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>

            <TouchableOpacity onPress={handleEmailPress}>
              <Text style={[styles.sectionText, { marginBottom: 5 }]}>📩 info@codediffusion.in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePhonePress}>
              <Text style={[styles.sectionText, { marginBottom: 5 }]}>📞 +91-7827114607</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleWebsitePress}>
              <Text style={[styles.sectionText, { marginBottom: 5 }]}>🌍 https://www.codediffusion.in</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={openGoogleMaps}>
              <Text style={[styles.sectionText]}>
                📍 Plot no 24, 2nd floor Sewak park Dwarka more New delhi - 110059
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2025 Code Diffusion Technologies. All Rights Reserved.</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  carouselContainer: {
    width,
  },
  carouselItem: {
    width,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  mainSection: {
    padding: 15,
    paddingVertical: 10,
  },
  section: {
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 24,
    marginBottom: 10,
  },
  footer: {
    padding: 10,
    paddingHorizontal: 0,
    alignItems: "center",
    backgroundColor: "#2c3e50",
  },
  footerText: {
    fontSize: 13,
    color: "#fff",
  },
});

export default ClientHome;
