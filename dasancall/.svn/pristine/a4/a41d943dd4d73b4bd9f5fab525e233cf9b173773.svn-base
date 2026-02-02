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

@Controller
public class CallIssueController {

	private static Logger logger = LogManager.getLogger(CallIssueController.class);

	@RequestMapping("/callIssue.do")
	public String callIssuePage(ModelMap model, HttpServletRequest req, HttpServletResponse res, Locale locale, HttpSession session) throws Exception {
		logger.info("call issue page : {}", locale);
		return "callIssue";
	}
}
