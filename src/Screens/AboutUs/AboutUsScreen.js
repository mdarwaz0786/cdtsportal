import React from "react";
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/Feather";

const AboutUsScreen = ({ navigation }) => {
  const url = "https://www.google.com/maps/place/Code+Diffusion+-+Mobile+Application+Development+Company+in+Delhi/@28.6290378,77.0703847,2542m/data=!3m3!1e3!4b1!5s0x396421a66a15b5f7:0x171170d419f52b5f!4m6!3m5!1s0x390d053a2359d897:0x7ade773a38d4c83d!8m2!3d28.6290194!4d77.0806845!16s%2Fg%2F11c2p478_s?entry=ttu&g_ep=EgoyMDI1MDMxMi4wIKXMDSoASAFQAw%3D%3D";

  const handleContactPress = (url) => {
    Linking.openURL(url);
  };

  const openGoogleMaps = () => {
    Linking.openURL(url);
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Icon
          name="arrow-left"
          size={20}
          color="#000"
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerTitle}>About Us</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={require("../../Assets/web-application-development.png")}
            style={styles.banner}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <Text style={styles.subHeader}>Best Web Development Company in Delhi</Text>
        <Text style={styles.text}>
          Code Diffusion is rewarded as Top 5 Website Development Company in Delhi, India that is propelled by the absolute tenacity, passion, and commitment to shine.
          We offer comprehensive and process-driven digital solutions to business companies.
          Our workforce is increasingly fortified by technical expertise and innovative articulation.
          We give our business clients a global and competitive platform to contend with and garner plentiful rewards and recognition.
          Be it website development, Website Designing in Delhi, we are backed up by compelling strategies and professional teams to deploy effective technological methodologies for our customers in the digital frameworks.
        </Text>

        <Text style={styles.subHeader}>Our Values</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>🌟 Innovation</Text>
          <Text style={styles.listItem}>🤝 Collaboration</Text>
          <Text style={styles.listItem}>🚀 Excellence</Text>
          <Text style={styles.listItem}>📈 Growth</Text>
        </View>

        <Text style={styles.subHeader}>What We Offer</Text>
        <View style={styles.list}>
          <Text style={styles.listItem}>🎨 Website Designing</Text>
          <Text style={styles.listItem}>💻 Website Development</Text>
          <Text style={styles.listItem}>📱 Mobile App Development</Text>
          <Text style={styles.listItem}>📢 Digital Marketing</Text>
          <Text style={styles.listItem}>🖌️ Graphic Designing</Text>
          <Text style={styles.listItem}>🔍 SEO Optimization</Text>
          <Text style={styles.listItem}>🛒 E-Commerce Solutions</Text>
          <Text style={styles.listItem}>🛠️ Maintenance & Support</Text>
          <Text style={styles.listItem}>🏭 Industrial Training</Text>
        </View>

        <Text style={styles.subHeader}>Our Vision</Text>
        <Text style={styles.text}>
          We aspire and pursue in becoming a top-ranking digital company concentrating on the unexplored realms of technology and supporting the customers to gain ground and a leading edge in business. We frame novel ideas for startup companies by rendering our specialized acumen.
        </Text>

        <Text style={styles.subHeader}>Our Mission</Text>
        <Text style={styles.text}>
          We campaign for a powerful and unfading pursuit to surpass the expectations of our customers and perform passionately to bring their crucial business needs to fruition, using our proficiency and domain skills. We also demonstrate sustainability towards the implementation and delivery of need-based web solutions for business companies.
        </Text>

        <Text style={styles.subHeader}>Our Goals</Text>
        <Text style={styles.text}>
          As the Best Website Development Company in Delhi, Janakpuri, our objectives are focused on delivering progressive solutions on a global spectrum, catapulting businesses beyond horizons and offering the companies an edge over working up revenues. Our experienced and inventive team pivots on developing thorough business systems in the light of advanced technologies to assist customers in their retention strategy in fiercely competitive environments.
        </Text>

        <Text style={styles.subHeader}>Our Services</Text>
        <Text style={styles.text}>
          Since the inception of our web development company in India in the year 2012, we have started working steadily towards enhancing the business of our customers with an eclectic mix of services intended to boost a company web presence.
        </Text>

        <Text style={styles.subHeader}>Our Team</Text>
        <Text style={styles.text}>
          Our talented team consists of skilled developers, creative designers,
          and strategic project managers, all working collaboratively to deliver
          the best results for your projects.
        </Text>

        <Text style={styles.subHeader}>Our History</Text>
        <Text style={styles.text}>
          Established in 2012, we have spent over a decade building a reputation
          for exceptional service and innovative solutions. From small startups
          to established enterprises, we've been a part of many success stories.
        </Text>

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

        <Text style={styles.footer}>
          Ready to transform your vision into reality? Let's build something
          amazing together!
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    zIndex: 1000,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
  },
  bannerContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  banner: {
    width: "1000%",
    height: 300,
    resizeMode: "stretch"
  },
  subHeader: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginTop: 10,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 10,
    textAlign: "justify",
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  contactSection: {
    padding: 0,
    marginTop: 20,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
    textAlign: "center",
  },
  contactText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  footer: {
    fontSize: 14,
    color: "#555",
    fontWeight: "400",
    marginTop: 10,
  },
});

export default AboutUsScreen;
