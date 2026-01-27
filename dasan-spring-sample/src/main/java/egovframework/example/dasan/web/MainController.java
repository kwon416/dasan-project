package egovframework.example.dasan.web;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.example.dasan.service.DailyStatsVO;
import egovframework.example.dasan.service.DasanService;
import egovframework.example.dasan.service.DataStatusVO;
import egovframework.example.dasan.service.DistrictVO;
import egovframework.example.dasan.service.KeywordVO;
import egovframework.example.dasan.service.TopComplaintVO;

/**
 * 다산콜 민원시스템 메인 컨트롤러
 */
@Controller
public class MainController {

    @Resource(name = "dasanService")
    private DasanService dasanService;

    private ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 메인 대시보드 페이지
     */
    @GetMapping("/main.do")
    public String main(Model model) throws Exception {
        // 데이터 상태 정보
        DataStatusVO dataStatus = dasanService.selectDataStatus();
        model.addAttribute("dataStatus", dataStatus);

        // 일별 민원 통계
        List<DailyStatsVO> dailyStats = dasanService.selectDailyStats();
        model.addAttribute("dailyStats", dailyStats);
        model.addAttribute("dailyStatsJson", objectMapper.writeValueAsString(dailyStats));

        // 기관별 Top10
        List<DistrictVO> districtTop10 = dasanService.selectDistrictTop10();
        model.addAttribute("districtTop10", districtTop10);
        model.addAttribute("districtTop10Json", objectMapper.writeValueAsString(districtTop10));

        // 오늘의 이슈 키워드 (워드클라우드용)
        List<KeywordVO> todayIssues = dasanService.selectTodayIssues();
        model.addAttribute("todayIssues", todayIssues);
        model.addAttribute("todayIssuesJson", objectMapper.writeValueAsString(todayIssues));
        model.addAttribute("todayIssuesTimestamp", dasanService.selectTodayIssuesTimestamp());

        // 오늘의 민원 Top10 테이블
        List<TopComplaintVO> todayTopComplaints = dasanService.selectTodayTopComplaints();
        model.addAttribute("todayTopComplaints", todayTopComplaints);
        model.addAttribute("todayTopComplaintsTimestamp", dasanService.selectTodayTopComplaintsTimestamp());

        // 페이지 메타 정보
        model.addAttribute("currentMenu", "main");
        model.addAttribute("pageTitle", "메인");

        return "main/main";
    }
}
