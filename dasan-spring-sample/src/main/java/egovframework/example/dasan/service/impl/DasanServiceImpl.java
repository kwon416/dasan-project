package egovframework.example.dasan.service.impl;

import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import org.egovframe.rte.fdl.cmmn.EgovAbstractServiceImpl;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import egovframework.example.dasan.service.DailyStatsVO;
import egovframework.example.dasan.service.DasanService;
import egovframework.example.dasan.service.DataStatusVO;
import egovframework.example.dasan.service.DistrictVO;
import egovframework.example.dasan.service.KeywordVO;
import egovframework.example.dasan.service.TopComplaintVO;

/**
 * 다산콜 민원 서비스 구현체
 * JSON 파일에서 데이터를 읽어 제공합니다.
 */
@Service("dasanService")
public class DasanServiceImpl extends EgovAbstractServiceImpl implements DasanService {

    private ObjectMapper objectMapper;
    private JsonNode districtsRoot;
    private JsonNode complaintsRoot;
    private JsonNode keywordsRoot;

    @PostConstruct
    public void init() throws Exception {
        objectMapper = new ObjectMapper();

        // JSON 파일 로드
        try (InputStream is = new ClassPathResource("data/districts.json").getInputStream()) {
            districtsRoot = objectMapper.readTree(is);
        }
        try (InputStream is = new ClassPathResource("data/complaints.json").getInputStream()) {
            complaintsRoot = objectMapper.readTree(is);
        }
        try (InputStream is = new ClassPathResource("data/keywords.json").getInputStream()) {
            keywordsRoot = objectMapper.readTree(is);
        }
    }

    @Override
    public DataStatusVO selectDataStatus() throws Exception {
        JsonNode status = districtsRoot.get("dataStatus");

        DataStatusVO vo = new DataStatusVO();
        vo.setCollectionStart(status.get("collectionPeriod").get("start").asText());
        vo.setCollectionEnd(status.get("collectionPeriod").get("end").asText());
        vo.setLastUpdated(status.get("lastUpdated").asText());
        vo.setTotalRecords(status.get("totalRecords").asInt());
        vo.setTotalDistricts(status.get("totalDistricts").asInt());
        vo.setMonthlyRecords(status.get("monthlyRecords").asInt());

        // 포맷된 날짜 설정
        vo.setCollectionStartFormatted(formatDate(vo.getCollectionStart()));
        vo.setLastUpdatedFormatted(formatDateTime(vo.getLastUpdated()));

        return vo;
    }

    @Override
    public List<DailyStatsVO> selectDailyStats() throws Exception {
        List<DailyStatsVO> list = new ArrayList<>();
        JsonNode dailyStats = complaintsRoot.get("dailyStats");

        for (JsonNode node : dailyStats) {
            DailyStatsVO vo = new DailyStatsVO();
            String date = node.get("date").asText();
            vo.setDate(date);
            vo.setTotalCount(node.get("totalCount").asInt());
            vo.setDisplayDate(formatDisplayDate(date));
            list.add(vo);
        }

        return list;
    }

    @Override
    public List<DistrictVO> selectDistrictTop10() throws Exception {
        List<DistrictVO> list = new ArrayList<>();
        JsonNode districts = districtsRoot.get("districts");

        for (JsonNode node : districts) {
            DistrictVO vo = new DistrictVO();
            vo.setCode(node.get("code").asText());
            vo.setName(node.get("name").asText());
            vo.setTotalComplaints(node.get("totalComplaints").asInt());

            JsonNode coords = node.get("coordinates");
            if (coords != null) {
                vo.setLat(coords.get("lat").asDouble());
                vo.setLng(coords.get("lng").asDouble());
            }

            list.add(vo);
        }

        // 민원 건수 기준 내림차순 정렬 후 Top10
        return list.stream()
                .sorted(Comparator.comparingInt(DistrictVO::getTotalComplaints).reversed())
                .limit(10)
                .collect(Collectors.toList());
    }

    @Override
    public List<KeywordVO> selectTodayIssues() throws Exception {
        List<KeywordVO> list = new ArrayList<>();
        JsonNode todayIssues = keywordsRoot.get("todayIssues");

        for (JsonNode node : todayIssues) {
            KeywordVO vo = new KeywordVO();
            vo.setText(node.get("text").asText());
            vo.setValue(node.get("value").asInt());
            list.add(vo);
        }

        return list;
    }

    @Override
    public String selectTodayIssuesTimestamp() throws Exception {
        String timestamp = keywordsRoot.get("todayIssuesTimestamp").asText();
        return formatDateTime(timestamp);
    }

    @Override
    public List<TopComplaintVO> selectTodayTopComplaints() throws Exception {
        List<TopComplaintVO> list = new ArrayList<>();
        JsonNode topComplaints = complaintsRoot.get("todayTopComplaints");

        for (JsonNode node : topComplaints) {
            TopComplaintVO vo = new TopComplaintVO();
            vo.setRank(node.get("rank").asInt());
            vo.setTitle(node.get("title").asText());
            vo.setCategory(node.get("category").asText());
            vo.setCount(node.get("count").asInt());
            vo.setTrend(node.get("trend").asText());
            list.add(vo);
        }

        return list;
    }

    @Override
    public String selectTodayTopComplaintsTimestamp() throws Exception {
        String timestamp = complaintsRoot.get("todayTopComplaintsTimestamp").asText();
        return formatDateTime(timestamp);
    }

    /**
     * 날짜를 "yyyy년 M월 d일" 형식으로 포맷
     */
    private String formatDate(String dateString) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy년 M월 d일", Locale.KOREA);
            Date date = inputFormat.parse(dateString);
            return outputFormat.format(date);
        } catch (Exception e) {
            return dateString;
        }
    }

    /**
     * 날짜시간을 "yyyy.MM.dd HH:mm" 형식으로 포맷
     */
    private String formatDateTime(String dateTimeString) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy.MM.dd HH:mm", Locale.KOREA);
            Date date = inputFormat.parse(dateTimeString);
            return outputFormat.format(date);
        } catch (Exception e) {
            return dateTimeString;
        }
    }

    /**
     * 날짜를 "M/d" 형식으로 포맷 (차트 X축용)
     */
    private String formatDisplayDate(String dateString) {
        try {
            SimpleDateFormat inputFormat = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat outputFormat = new SimpleDateFormat("M/d");
            Date date = inputFormat.parse(dateString);
            return outputFormat.format(date);
        } catch (Exception e) {
            return dateString;
        }
    }
}
