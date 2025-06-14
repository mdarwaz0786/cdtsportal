import React from "react";
import { View, ScrollView, Text, StyleSheet, Image, TouchableOpacity, Linking } from "react-native";

const Service = () => {
  const url = "https://www.google.com/maps/place/Code+Diffusion+-+Mobile+Application+Development+Company+in+Delhi/@28.6290378,77.0703847,2542m/data=!3m3!1e3!4b1!5s0x396421a66a15b5f7:0x171170d419f52b5f!4m6!3m5!1s0x390d053a2359d897:0x7ade773a38d4c83d!8m2!3d28.6290194!4d77.0806845!16s%2Fg%2F11c2p478_s?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D";

  const handleContactPress = (url) => {
    Linking.openURL(url);
  };

  const openGoogleMaps = () => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Our Services</Text>
        <Text style={styles.headerSubtitle}>Innovative & Scalable Digital Solutions</Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/web-development.jpg")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Custom Website Development</Text>
        <Text style={styles.serviceDescription}>
          We specialize in designing and developing fully customized websites tailored to your business needs. Our web solutions are built using cutting-edge technologies like React, Angular, Next.js, and Vue.js, ensuring optimal performance, scalability, and security. Whether you need a corporate website, an eCommerce store, or a personal portfolio, we deliver visually appealing and high-performing solutions.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/mobile-app.jpg")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Mobile App Development (iOS & Android)</Text>
        <Text style={styles.serviceDescription}>
          Our mobile app development services focus on creating high-quality, user-friendly, and efficient applications for both iOS and Android platforms. We leverage frameworks like React Native and Flutter to develop cross-platform apps that provide a seamless experience. From startup MVPs to enterprise-level applications, we ensure feature-rich, scalable, and engaging mobile solutions.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/ui-ux.png")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>UI/UX Design & Branding</Text>
        <Text style={styles.serviceDescription}>
          A compelling design is key to user engagement. Our UI/UX design team creates intuitive, modern, and visually appealing interfaces that enhance user experience and reinforce brand identity. We focus on wireframing, prototyping, usability testing, and branding to ensure a smooth and interactive user journey for your digital product.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/cloud-backend.png")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Cloud & Backend Solutions</Text>
        <Text style={styles.serviceDescription}>
          Our backend development services focus on building scalable and secure server-side applications using modern frameworks like Node.js, PHP, and databases such as MongoDB and MySQL. We also provide cloud-based solutions leveraging AWS, Firebase, and Google Cloud to ensure high availability, robust security, and seamless performance.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/digital-marketing.png")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Digital Marketing & SEO</Text>
        <Text style={styles.serviceDescription}>
          Enhance your online presence and drive business growth with our digital marketing and SEO services. We specialize in keyword optimization, content marketing, pay-per-click (PPC) advertising, social media marketing, and analytics-driven strategies. Our goal is to increase traffic, boost engagement, and improve conversions through data-driven campaigns.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/graphic-designing.png")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Graphic Designing</Text>
        <Text style={styles.serviceDescription}>
          Our creative graphic designing services cater to businesses looking for high-quality visual communication. From logo design, business cards, brochures, and social media graphics to complete branding solutions, we craft visually appealing designs that enhance your brand identity. Our team ensures that every design aligns with your business goals and resonates with your target audience.
        </Text>
      </View>

      <View style={styles.serviceSection}>
        <Image source={require("../../../Assets/industrial-training.jpg")} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Industrial Training</Text>
        <Text style={styles.serviceDescription}>
          Our industrial training programs provide hands-on experience in various technologies such as web development, mobile app development, UI/UX design, and digital marketing. Designed for students and professionals, our training programs help bridge the gap between theoretical knowledge and practical industry demands. With expert mentors, real-world projects, and certification, we prepare individuals for successful careers in the tech industry.
        </Text>
      </View>

      <View style={styles.contactSection}>
        <Text style={styles.contactTitle}>Get in Touch</Text>
        <TouchableOpacity onPress={openGoogleMaps}>
          <Text style={styles.contactText}>📍 Plot no 24, 2nd floor Sewak park Dwarka more New delhi - 110059</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleContactPress('mailto:info@codediffusion.in')}>
          <Text style={styles.contactText}>📩 info@codediffusion.in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleContactPress('tel:+91-7827114607')}>
          <Text style={styles.contactText}>📞 +91-7827114607</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleContactPress('https://www.codediffusion.in')}>
          <Text style={styles.contactText}>🌍 www.codediffusion.in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    padding: 10,
    backgroundColor: "#2c3e50",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "500",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#d1d1d1",
  },
  serviceSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  serviceImage: {
    width: "100%",
    height: 200,
    resizeMode: "stretch",
    marginBottom: 10,
    borderRadius: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  contactSection: {
    padding: 20,
    backgroundColor: "#2c3e50",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 10,
    textAlign: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#ddd",
    marginBottom: 10,
  },
});

export default Service;
