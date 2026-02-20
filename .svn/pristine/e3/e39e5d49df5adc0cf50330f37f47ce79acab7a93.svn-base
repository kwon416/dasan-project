package kr.or.dasancall.web;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.dasancall.service.DashboardVO;
import kr.or.dasancall.service.MainService;

@Controller
public class MainController {

	private static Logger logger = LogManager.getLogger(MainController.class);

	@Resource(name = "mainService")
	private MainService mainService;

	@Value("${server.url}")
	String srcDbUrl;

	@RequestMapping({ "/index.do", "/" })
	public String indexPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model,
			HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("main page : {}", locale);
		return "index";
	}
	
	@RequestMapping("/search.do")
	public String searchPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model,
			HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("search page : {}", locale);
		return "search";
	}
	
	@RequestMapping("/search_result.do")
	public String searchResultPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model,
			HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("search result page : {}", locale);
		return "search_result";
	}

	@RequestMapping("/data/selectDataList.do")
	public @ResponseBody Map<String, Object> selectDataList(HttpServletRequest req,
			@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model, HttpSession session) throws Exception {
		logger.info("/data/selectDataList ");
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();

		List<HashMap<String, Object>> list = mainService.selectDataList(vo);
		try {
			resultMap.put("features", list);
		} catch (Exception ex) {
			resultMap.put("오류발생", "Exception");
		}
		return resultMap;
	}

	/**
	 * 대시보드 메인 API
	 * POST /data/dashboard.do
	 * RequestBody: { "today": "2026-02-10" | null, "gu": "강남구" | null, "keyword": "주정차" | null }
	 */
	@RequestMapping(value = "/data/dashboard.do", method = RequestMethod.POST)
	@ResponseBody
	public Map<String, Object> selectDashboardData(@RequestBody DashboardVO vo) {
		logger.info("/data/dashboard.do - today: {}, gu: {}, keyword: {}", vo.getToday(), vo.getGu(), vo.getKeyword());
		Map<String, Object> resultMap = new LinkedHashMap<>();
		try {
			resultMap = mainService.selectDashboardData(vo);
		} catch (Exception ex) {
			logger.error("Dashboard API error", ex);
			resultMap.put("error", "데이터 조회 중 오류가 발생했습니다.");
		}
		return resultMap;
	}

}
