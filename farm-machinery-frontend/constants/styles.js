import { Platform } from "react-native";

// constants.js
export const COLORS = {
  PRIMARY: "rgb(76, 175, 80)", // Vibrant green for buttons and primary actions
  SECONDARY: "rgb(46, 125, 50)", // Darker green for text and accents
  TERTIARY: "rgb(36, 97, 39)", // Darker version of secondary
  BACKGROUND: "rgb(245, 246, 241)", // Light earthy background
  INPUT_BG: "rgb(255, 255, 255)", // White background for inputs
  BORDER: "rgb(164, 191, 166)", // Subtle green border
  PLACEHOLDER: "rgb(138, 154, 134)", // Gray-green for placeholder text
  TEXT: "rgb(51, 51, 51)", // Dark gray for input text
};

export const SIZES = {
  TITLE: 32, // Font size for title
  BUTTON_TEXT: 18, // Font size for button text
  INFO_TEXT: 16, // Font size for info/resend text
  INPUT_HEIGHT: 50, // Height for inputs and boxes
  COUNTRY_CODE_WIDTH: 60, // Width for country code input
  BORDER_RADIUS: 8, // Consistent border radius
  PADDING: 20, // Container padding
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
  header: {
    fontSize: SIZES.TITLE,
    fontFamily: FONTS.BOLD,
    color: COLORS.TERTIARY,
    marginBottom: SIZES.MARGIN_LARGE,
    textAlign: "center",
  },
  tile: {
    backgroundColor: COLORS.INPUT_BG,
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
    backgroundColor: `${COLORS.PRIMARY}20`,
  },
  tileTitle: {
    fontSize: SIZES.BUTTON_TEXT,
    fontFamily: FONTS.BOLD,
    color: COLORS.TEXT,
    marginBottom: SIZES.MARGIN_SMALL,
  },
  selectedTileTitle: {
    color: COLORS.INPUT_BG,
  },
  tileDescription: {
    fontSize: SIZES.INFO_TEXT,
    fontFamily: FONTS.REGULAR,
    color: COLORS.PLACEHOLDER,
    fontWeight: "bold",
  },
  selectedTileDescription: {
    color: COLORS.TERTIARY,
  },
};



  