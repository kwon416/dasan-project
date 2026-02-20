package kr.or.dasancall.web;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 민원 분석 컨트롤러
 * - 지역별 분석 (/complaint/region.do)
 * - 기간별 분석 (/complaint/period.do)
 */
@Controller
@RequestMapping("/complaint")
public class ComplaintController {

	private static Logger logger = LogManager.getLogger(ComplaintController.class);

	/**
	 * 지역별 분석 페이지
	 */
	@RequestMapping("/region.do")
	public String regionPage(ModelMap model, HttpServletRequest req, HttpServletResponse res,
			Locale locale, HttpSession session) throws Exception {
		logger.info("complaint region page : {}", locale);

		return "complaint/region";
	}

	/**
	 * 기간별 분석 페이지
	 */
	@RequestMapping("/period.do")
	public String periodPage(ModelMap model, HttpServletRequest req, HttpServletResponse res,
			Locale locale, HttpSession session) throws Exception {
		logger.info("complaint period page : {}", locale);

		return "complaint/period";
	}

	/**
	 * 키워드 검색 분석 페이지
	 */
	@RequestMapping("/keyword.do")
	public String keywordPage(ModelMap model, HttpServletRequest req, HttpServletResponse res,
			Locale locale, HttpSession session) throws Exception {
		logger.info("complaint keyword page : {}", locale);

		return "complaint/keyword";
	}

	/**
	 * Top5 키워드 통계 페이지
	 */
	@RequestMapping("/top5.do")
	public String top5Page(ModelMap model, HttpServletRequest req, HttpServletResponse res,
			Locale locale, HttpSession session) throws Exception {
		logger.info("complaint top5 page : {}", locale);

		return "complaint/top5";
	}
}
