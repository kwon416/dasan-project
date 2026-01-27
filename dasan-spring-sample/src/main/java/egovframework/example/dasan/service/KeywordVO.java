package egovframework.example.dasan.service;

/**
 * 키워드 VO (워드클라우드용)
 */
public class KeywordVO {

    /** 키워드 텍스트 */
    private String text;

    /** 키워드 빈도/가중치 */
    private int value;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }
}
