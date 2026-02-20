package kr.or.dasancall.web;

import java.util.Locale;

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

import kr.or.dasancall.service.DashboardVO;
import kr.or.dasancall.service.MainService;

@Controller
public class AdminController {
	private static Logger logger = LogManager.getLogger(AdminController.class);
	
	@Resource(name = "mainService")
	private MainService mainService;
	
	@RequestMapping("/mgmtsystem/login.do")
	public String loginPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model,
			HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("login page");
		return "admin/login";
	}
	
	@RequestMapping("/mgmtsystem/user.do")
	public String userPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model,
			HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("user admin page");
		return "admin/admin_user";
	}
	
	@RequestMapping("/mgmtsystem/keyword.do")
	public String keywordPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model,
			HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("keyword admin page");
		return "admin/admin_keyword";
	}
	
	@RequestMapping("/mgmtsystem/log.do")
	public String logPage(@ModelAttribute("dashboardVO") DashboardVO vo, ModelMap model,
			HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("log admin page");
		return "admin/admin_log";
	}
	
}
