package com.springframework.hoxify.tools;

/*
PROJECT NAME : hoxify
Module NAME: IntelliJ IDEA
Author Name : @ DRRONIDZ
DATE : 5/2/2022 2:01 AM
*/

public class Tools {
    public static void main(String[] args) {
        System.out.println(convertARSentenceToUnicode("كلمة السر لا يمكن ان تكون فارغة"));
    }

    public static String convertARSentenceToUnicode(String input) {
        StringBuilder buf = new StringBuilder();
        for (int i = 0; i < input.length(); i++) {
            char ch = input.charAt(i);
            if (ch >= 32 && ch < 127)
                buf.append(ch);
            else
                buf.append(String.format("\\u%04x", (int) ch));
        }
        String result = buf.toString();
        return result;
    }
}
