package egovframework.dasan.common;

import java.io.Serializable;

import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DASAN 민원 시스템 공통 VO 클래스
 * 페이징, 검색 등 공통 속성 정의
 *
 * @author kwon416
 * @since 2026.01.19
 * @version 1.0
 */
@Schema(description = "DASAN 공통 VO")
@Getter
@Setter
public class DasanComDefaultVO implements Serializable {

	private static final long serialVersionUID = 1L;

	/** 검색 조건 */
	@Schema(description = "검색조건")
	private String searchCnd = "";

	/** 검색 키워드 */
	@Schema(description = "검색키워드")
	private String searchWrd = "";

	/** 검색 시작일 */
	@Schema(description = "검색시작일(YYYY-MM-DD)")
	private String searchBgnDe = "";

	/** 검색 종료일 */
	@Schema(description = "검색종료일(YYYY-MM-DD)")
	private String searchEndDe = "";

	/** 현재 페이지 번호 */
	@Schema(description = "현재페이지", example = "1")
	private int pageIndex = 1;

	/** 페이지당 게시물 수 */
	@Schema(description = "페이지당 게시물 수", example = "10")
	private int pageUnit = 10;

	/** 페이지 크기 */
	@Schema(description = "페이지 크기", example = "10")
	private int pageSize = 10;

	/** 첫 페이지 인덱스 */
	@Schema(description = "첫페이지 인덱스")
	private int firstIndex = 1;

	/** 마지막 페이지 인덱스 */
	@Schema(description = "마지막페이지 인덱스")
	private int lastIndex = 1;

	/** 페이지당 레코드 개수 */
	@Schema(description = "페이지당 레코드 개수", example = "10")
	private int recordCountPerPage = 10;

	/** 행 번호 */
	@Schema(description = "행 번호")
	private int rowNo = 0;

	/** 정렬 순서 */
	@Schema(description = "정렬순서(ASC/DESC)", example = "DESC")
	private String sortOrdr = "DESC";

	/** 정렬 컬럼 */
	@Schema(description = "정렬컬럼", example = "reg_dt")
	private String sortColumn = "";
}
