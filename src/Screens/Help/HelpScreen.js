import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";

const HelpScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.subHeader}>FAQs</Text>
        <View style={styles.faqContainer}>
          <Text style={styles.faqQuestion}>
            Q1: How do I get started with your services?
          </Text>
          <Text style={styles.faqAnswer}>
            A1: Simply contact us via our website or email, and we’ll schedule a consultation to understand your requirements.
          </Text>

          <Text style={styles.faqQuestion}>
            Q2: What types of web development services do you offer?
          </Text>
          <Text style={styles.faqAnswer}>
            A2: We specialize in custom web development, mobile-friendly design, e-commerce solutions, and SEO optimization.
          </Text>

          <Text style={styles.faqQuestion}>
            Q3: What is Digital Marketing and how can it help my business?
          </Text>
          <Text style={styles.faqAnswer}>
            A3: Digital marketing involves promoting businesses through online channels like social media, search engines, and email. It helps businesses increase visibility, attract customers, and boost revenue.
          </Text>

          <Text style={styles.faqQuestion}>
            Q4: How does SEO improve website ranking?
          </Text>
          <Text style={styles.faqAnswer}>
            A4: SEO (Search Engine Optimization) improves website ranking by optimizing content, keywords, backlinks, and site structure. This helps your website appear higher on search engines like Google.
          </Text>

          <Text style={styles.faqQuestion}>
            Q5: What graphic design services do you offer?
          </Text>
          <Text style={styles.faqAnswer}>
            A5: We provide logo design, branding, UI/UX design, social media graphics, posters, business cards, and more.
          </Text>

          <Text style={styles.faqQuestion}>
            Q6: How long does it take to develop a mobile app?
          </Text>
          <Text style={styles.faqAnswer}>
            A6: The timeline depends on app complexity and features. Basic apps take 4-6 weeks, while advanced apps can take several months.
          </Text>

          <Text style={styles.faqQuestion}>
            Q7: Do you provide industrial training?
          </Text>
          <Text style={styles.faqAnswer}>
            A07: Yes, we offer industrial training programs in web development, mobile app development, digital marketing, and UI/UX design to help professionals gain hands-on experience.
          </Text>

          <Text style={styles.faqQuestion}>
            Q8: Who can enroll in your industrial training programs?
          </Text>
          <Text style={styles.faqAnswer}>
            A8: Our training is ideal for students, fresh graduates, and working professionals looking to upskill in IT and digital services.
          </Text>

          <Text style={styles.faqQuestion}>
            Q9: How can I contact customer support?
          </Text>
          <Text style={styles.faqAnswer}>
            A9: You can reach out to our support team via email at info@codediffusion.in or call us at +91-7827114607.
          </Text>

          <Text style={styles.faqQuestion}>
            Q10: How long does it take to complete a project?
          </Text>
          <Text style={styles.faqAnswer}>
            A10: The duration depends on the project’s complexity and scope. Generally, it ranges from a few weeks to several months.
          </Text>

          <Text style={styles.faqQuestion}>
            Q11: Do you provide post-launch support and maintenance?
          </Text>
          <Text style={styles.faqAnswer}>
            A11: Yes, we offer post-launch support and maintenance services to ensure your application runs smoothly.
          </Text>

          <Text style={styles.faqQuestion}>
            Q12: Can I request custom features for my project?
          </Text>
          <Text style={styles.faqAnswer}>
            A12: Absolutely! We specialize in custom development to meet your unique requirements.
          </Text>

          <Text style={styles.faqQuestion}>
            Q13:  Do you handle hosting and domain setup?
          </Text>
          <Text style={styles.faqAnswer}>
            A13: Yes, we can assist with hosting, domain setup, and configuration to ensure a seamless deployment process.
          </Text>

          <Text style={styles.faqQuestion}>
            Q14: What payment methods do you accept?
          </Text>
          <Text style={styles.faqAnswer}>
            A14: We accept various payment methods including bank transfers, credit cards, and digital wallets.
          </Text>
        </View>

        <Text style={styles.subHeader}>Contact Support</Text>
        <Text style={styles.text}>
          For any inquiries or technical issues, please don't hesitate to get in touch with our support team. We're here to help!
        </Text>
        <Text style={styles.supportDetails} onPress={() => handleContactPress('mailto:info@codediffusion.in')}>Email: info@codediffusion.in</Text>
        <Text style={styles.supportDetails} onPress={() => handleContactPress('tel:+91-7827114607')}>Phone: +91-7827114607</Text>

        <View style={styles.linkContainer}>
          <Text style={styles.subHeader}>Useful Links</Text>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.codediffusion.in")}>
            <Text style={styles.link}>👉 Visit our [Website] (https://www.codediffusion.in) for more information. </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://www.codediffusion.info")}>
            <Text style={styles.link}>👉 Visit our [Website] (https://www.codediffusion.info) for more information.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.subHeader}>Get in Touch</Text>
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
          We're committed to providing top-notch support. Thank you for choosing us!
        </Text>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 10,
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
  subHeader: {
    fontSize: 16,
    fontWeight: "400",
    color: "#000",
    marginBottom: 5,
    textAlign: "center",
  },
  faqContainer: {
    marginBottom: 5,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "400",
    color: "#333",
    marginBottom: 1,
  },
  faqAnswer: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  text: {
    fontSize: 14,
    color: "#555",
    marginBottom: 15,
  },
  supportDetails: {
    fontSize: 14,
    color: "#555",
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    fontSize: 14,
    color: "#0066cc",
    marginBottom: 5,
  },
  contactSection: {
    marginTop: 16,
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
    marginTop: 20,
  },
});

export default HelpScreen;
