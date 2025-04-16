import { Platform } from "react-native";

// constants.js
export const COLORS = {
  /**
   * rgb(20, 61, 96)
   * A very dark gray that serves as the foundation of the dark mode interface.
   * It's not pure black, providing a softer contrast that's easier on the eyes
   * while evoking the depth of night-time fields or rich soil.
   */
  BACKGROUND: "rgb(12, 39, 61)",
  /**
   * Primary: #2E7D32
   * A muted, dark green representing crops and plant life, central to agriculture.
   * This color is ideal for primary buttons, headers, or interactive elements,
   * offering a natural and earthy feel that stands out against the dark background.
   */
  PRIMARY: "#A0C878",
  /**
   * Secondary: #795548
   * A warm brown inspired by fertile soil or wooden farm elements.
   * This color complements the primary green and can be used for secondary
   * buttons, borders, or less prominent UI elements.
   */
  SECONDARY: "#DDEB9D",
  /**
   * Accent: #FFA726
   * A vibrant orange-yellow reminiscent of ripe harvests, sunlight, or
   * attention-grabbing farm alerts.
   * It's perfect for highlights, call-to-action buttons, or notifications, adding
   * a pop of color that draws the eye without overwhelming the dark theme.
   */
  ACCENT: "rgb(235, 91, 0)",
  /**
   * Text Primary: #FFFFFF
   * Pure white for the main text, ensuring maximum readability and contrast
   * against the dark background.
   * Use this for headings, labels, and primary content.
   */
  TEXT_LIGHT: "#FFFFFF",
  /**
   * Text Secondary: #B0BEC5
   * A light gray-blue for secondary text, such as descriptions, captions, or
   * disabled states.
   * It maintains legibility while distinguishing less critical information from
   * primary text.
   */
  TEXT_DARK: "rgb(20, 61, 96)",
};

export const SIZES = {
  TITLE: 32, // Font size for title
  BUTTON_TEXT: 18, // Font size for button text
  INFO_TEXT: 16, // Font size for info/resend text
  INPUT_HEIGHT: 50, // Height for inputs and boxes
  COUNTRY_CODE_WIDTH: 60, // Width for country code input
  BORDER_RADIUS: 8, // Consistent border radius
  PADDING: 20, // Container padding
  PADDING_SM: 10,
  SPACING: 5, // Spacing between digit boxes
  MARGIN_SMALL: 2, // Small margin for digit boxes
  MARGIN_MEDIUM: 10, // Medium margin for resend link
  MARGIN_LARGE: 20, // Large margin for sections
};

// Define fonts in constants/styles.js
export const FONTS = {
  REGULAR: Platform.OS === "ios" ? "Helvetica Neue" : "Roboto",
  MEDIUM: Platform.OS === "ios" ? "HelveticaNeue-Medium" : "Roboto-Medium",
};

export const GLOBAL_STYLES = {
  button: {
    backgroundColor: COLORS.PRIMARY,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  header: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
  tile: {
    backgroundColor: COLORS.SECONDARY,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
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
    backgroundColor: `${COLORS.TERTIARY}20`,
  },
  tileTitle: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  selectedTileTitle: {
    color: COLORS.PRIMARY,
  },
  tileDescription: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.PRIMARY,
    fontWeight: "bold",
  },
  selectedTileDescription: {
    color: COLORS.TERTIARY,
  },
};



  