import { Platform } from "react-native";

// constants.js
export const COLORS = {
  PRIMARY: "#024034",
  SECONDARY: "#72BF4E",
  TERTIARY: "#F2A81D",
  BACKGROUND: "#F2EDE9",
  INPUT_BG: "#87A668",
  BORDER: "PRIMARY",
  PLACEHOLDER: "rgb(138, 154, 134)",
  TEXT: "rgb(51, 51, 51)",
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



  