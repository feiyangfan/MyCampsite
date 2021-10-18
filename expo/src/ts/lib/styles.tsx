import {StyleSheet} from "react-native"

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#334257",
        color: "white",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        color: "white"
    },
    btnWrapper: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
      },
    btnText: {
        textAlign: "center",
        color: "white",
        fontSize: 20
    },
    btn: {
        backgroundColor: "grey",
        borderWidth: 1,
        borderRadius: 10,
        padding: 7,
        width: "50%",
    }
})
export default styles
