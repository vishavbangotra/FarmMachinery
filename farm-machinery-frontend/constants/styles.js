import { Platform } from "react-native";

// constants.js
export const COLORS = {
  /**
   * #f0ffe2
   * A very light, pastel green that serves as the foundation of the light theme interface.
   * This soft hue provides a gentle contrast that’s easy on the eyes,
   * evoking fresh fields at dawn or new plant shoots.
   */
  BACKGROUND: "#f0ffe2",
  /**
   * Primary: #59981A
   * A rich, dark green representing healthy crops and lush foliage.
   * Ideal for primary buttons, headers, or interactive elements,
   * offering a natural, earthy feel against lighter backgrounds.
   */
  PRIMARY: "#59981A",
  /**
   * Secondary: #81B622
   * A vibrant medium green inspired by fresh leaves and growth.
   * Complements the primary tone and suits secondary buttons, borders,
   * or less prominent UI elements with an organic touch.
   */
  SECONDARY: "#81B622",
  /**
   * Accent: #ECF87F
   * A bright yellow-green reminiscent of early spring buds or
   * sunlit fields. Perfect for highlights, call-to-action buttons,
   * or notifications, adding a fresh pop of color without overwhelming.
   */
  ACCENT: "#ECF87F",
  /**
   * Tertiary/Text Primary: #3D550C
   * A deep olive green used for main text, ensuring strong readability
   * and subtle warmth against the light background.
   */
  TERTIARY: "#3D550C",
  /**
   * Text Light (Disabled/Placeholder): #B0BEC5
   * A cool gray-blue for disabled states, placeholders, or secondary text,
   * ensuring sufficient contrast without competing with primary content.
   */

  TEXT_LIGHT: "#fff",
  /**
   * Text Dark: #37520B
   * A dark moss green for labels or captions, slightly lighter than tertiary,
   * maintaining contrast while distinguishing less critical text.
   */
  TEXT_DARK: "#37520B",

  /**
   * Error: #CA0B00
   * A vibrant red for error messages, warnings, or critical notifications,
   * ensuring attention is drawn to important issues or user actions.
   *  */
  ERROR: "#CA0B00",
};

export const SIZES = {
  TITLE: 18, // Font size for titles or main headings
  BUTTON_TEXT: 18, // Font size for button labels
  INFO_TEXT: 16, // Font size for informational text or captions
  INPUT_HEIGHT: 50, // Height for text inputs and interactive boxes
  COUNTRY_CODE_WIDTH: 60, // Width allocated for country code inputs
  BORDER_RADIUS: 8, // Standard border radius for rounded elements
  PADDING: 20, // Default container padding
  PADDING_SM: 10, // Small padding
  SPACING: 5, // Space between elements, e.g., digit boxes
  MARGIN_SMALL: 2, // Small margin, often for tight layouts
  MARGIN_MEDIUM: 10, // Medium margin for spacing sections
  MARGIN_LARGE: 20, // Large margin for major section separation
};

// Define fonts in constants/styles.js
export const FONTS = {
  REGULAR: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  MEDIUM: Platform.OS === "ios" ? "HelveticaNeue-Medium" : "Roboto-Medium",
  BOLD: Platform.OS === "ios" ? "HelveticaNeue-Bold" : "Roboto-Bold",
  CONDENSED: Platform.OS === "ios" ? "HelveticaNeue-CondensedBlack" : "Roboto-Condensed",
};

export const GLOBAL_STYLES = {
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 14,
    borderRadius: SIZES.BORDER_RADIUS,
    alignItems: "center",
    marginTop: SIZES.MARGIN_MEDIUM,
  },
  header: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
  sectionHeader: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginVertical: SIZES.MARGIN_SMALL,
    textAlign: "left",
  },
  machineIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  machineIconSelected: {
    backgroundColor: COLORS.ACCENT,
  },
  machineLabel: {
    marginTop: SIZES.SPACING,
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.TEXT_DARK,
    textAlign: "center",
  },
  machineLabelSelected: {
    color: COLORS.ACCENT,
    fontFamily: FONTS.BOLD,
  },
  tile: {
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.ACCENT,
    borderRadius: SIZES.BORDER_RADIUS,
    padding: SIZES.MARGIN_MEDIUM,
    marginBottom: SIZES.MARGIN_MEDIUM,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTile: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: `${COLORS.TERTIARY}20`, // 12% opacity
  },
  tileTitle: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  selectedTileTitle: {
    color: COLORS.PRIMARY,
  },
  tileDescription: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    fontWeight: "bold",
    color: COLORS.TERTIARY,
  },
  selectedTileDescription: {
    color: COLORS.PRIMARY,
  },
};
