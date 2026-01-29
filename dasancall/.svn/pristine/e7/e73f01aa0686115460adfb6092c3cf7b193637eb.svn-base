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
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import kr.or.dasancall.service.DashboardVO;
import kr.or.dasancall.service.MainService;

@Controller
public class MainController {

	private static Logger logger = LogManager.getLogger(MainController.class);
	
	@Resource (name = "mainService")
	private MainService mainService;
	
	@RequestMapping({"/index.do", "/"})
	public String indexPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model, HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("main page : {}", locale);
		return "index";
	}
	
	@RequestMapping("/data/selectDataList.do")
	public @ResponseBody Map<String, Object> selectDataList( HttpServletRequest req, @ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model, HttpSession session) throws Exception {
		logger.info("/data/selectDataList ");
		Map<String, Object> resultMap = new LinkedHashMap<String, Object>();
		
		List<HashMap<String, Object>> list = mainService.selectDataList(vo);
		try {
			resultMap.put("features",list);
		} catch (Exception ex) {
			resultMap.put("exception", ex.getMessage());
		}
		return resultMap;
	}
}
