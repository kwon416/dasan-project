package kr.or.dasancall.service.batchdbImpl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.List;

import javax.annotation.Resource;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.egovframe.rte.psl.dataaccess.util.EgovMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import kr.or.dasancall.service.impl.BatchTargetMapper;

@SuppressWarnings("unused")
@EnableScheduling
@PropertySource("classpath:/dasan/config/properties/config.properties")
@Service("schedulerService")
public class BatchScheduler {

	private static Logger logger = LogManager.getLogger(BatchScheduler.class);

	@Resource(name = "batchSourceMapper")
	private BatchSourceMapper batchSourceMapper;

	@Resource(name = "batchTargetMapper")
	private BatchTargetMapper batchTargetMapper;
//
//	@Resource(name = "mainService")
//	private MainService mainService;

	@Value("${bath.run.yn}")
	String batchRun;

	boolean isOk;

	@Scheduled(cron = "${batch.day.time}")
	public void dailyBatchProcess() throws Exception {
		logger.info("batchRun : " + batchRun);
		if ("N".equals(batchRun))
			return;

		logger.info("Daily Batch Schedule START.");
		isOk = true;

		EgovMap paramMap = new EgovMap();
		String yesterday = getStdrDate(-1);
		logger.info(yesterday);
		
		try {
			int testDb = batchSourceMapper.testDb();
			if (testDb > 0) {
				logger.info("source db is ok.");
			} else {
				logger.info("source db is not ok.");
				return;
			}
		} catch (Exception exp) {
			logger.error("test db error.");
			return;
		}
		
		paramMap.put("yy", yesterday.substring(0, 4));
		paramMap.put("mm", yesterday.substring(4, 6));
		paramMap.put("dd", yesterday.substring(6, 8));
		loadConsultData(paramMap);

		logger.info("Daily Batch Schedule END.");
	}

	@Scheduled(cron = "${batch.hour.time}")
	public void hourlyBatchProcess() {
		logger.info("batchRun : " + batchRun);
		if ("N".equals(batchRun))
			return;

		EgovMap paramMap = new EgovMap();
		String prevHour = getStdrHour(-1);
		logger.info(prevHour);
		
		logger.info("Hourly Batch Schedule START.");
		try {
			int testDb = batchSourceMapper.testDb();
			if (testDb > 0) {
				logger.info("source db is ok.");
			} else {
				logger.info("source db is not ok.");
				return;
			}
		} catch (Exception exp) {
			logger.error("test db error.");
			return;
		}
		paramMap.put("yy", prevHour.substring(0, 4));
		paramMap.put("mm", prevHour.substring(4, 6));
		paramMap.put("dd", prevHour.substring(6, 8));
		paramMap.put("hh", prevHour.substring(8, 10));
//		paramMap.put("yy", "2026");
//		paramMap.put("mm", "02");
//		paramMap.put("dd", "05");
		//paramMap.put("hh", "23");
//		for (int i=0;i<=23;i++) {
//			paramMap.put("hh", String.format("%02d", i));
//			loadCallData(paramMap);
//		}
		loadCallData(paramMap);
		logger.info("Hourly Batch Schedule END.");
	}

	private String getStdrDate(int std) {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
		Calendar time = Calendar.getInstance();
		time.add(Calendar.DATE, std);

		String formatDate = format.format(time.getTime());
		return formatDate;
	}
	
	private String getStdrHour(int std) {
		SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHH");
		Calendar time = Calendar.getInstance();
		time.add(Calendar.HOUR_OF_DAY, std);

		String formatDate = format.format(time.getTime());
		return formatDate;
	}
	
	private void loadConsultData(EgovMap paramMap) {
		try {
			long cnt = batchSourceMapper.getConsultCount(paramMap);
			logger.info("Consult Data Count: {}", cnt);
			if (cnt > 0) {
				List<EgovMap> list = batchSourceMapper.selectBatchConsult(paramMap);
				if(list != null && list.size() != 0) {
					int deleteCount = batchTargetMapper.deleteStatConsult(paramMap);
					logger.info("Consult Data Delete Count: {}", deleteCount);
					for (int j=0 ; j<list.size(); j+=10000) {
						if (j < (list.size() - 10000)) {
							paramMap.put("list", list.subList(j, j+10000));
						} else {
							paramMap.put("list", list.subList(j, list.size()));
						}
						batchTargetMapper.insertStatConsult(paramMap);
					}
					logger.info("tb_stat_consult {}-{}-{}, {} count load.", paramMap.get("yy"), paramMap.get("mm"), paramMap.get("dd"), list.size());
				}
			}
		} catch (Exception exp) {
			logger.error("error.");
			return;
		}
	}
	
	private void loadCallData(EgovMap paramMap) {
		try {
			long cnt = batchSourceMapper.getCallCount(paramMap);
			logger.info("Call Data Count: {}", cnt);
			if (cnt > 0) {
				List<EgovMap> list = batchSourceMapper.selectBatchCall(paramMap);
				if(list != null && list.size() != 0) {
					int deleteCount = batchTargetMapper.deleteStatCall(paramMap);
					logger.info("Call Data Delete Count: {}", deleteCount);
					for (int j=0 ; j<list.size(); j+=10000) {
						if (j < (list.size() - 10000)) {
							paramMap.put("list", list.subList(j, j+10000));
						} else {
							paramMap.put("list", list.subList(j, list.size()));
						}
						batchTargetMapper.insertStatCall(paramMap);
					}
					logger.info("tb_stat_call {}-{}-{} {}, {} count load.", paramMap.get("yy"), paramMap.get("mm"), paramMap.get("dd"), paramMap.get("hh"), list.size());
				}
			}
		} catch (Exception exp) {
			logger.error("error.");
			return;
		}
	}

	/**
	 * 안전지수그리드
	 * 
	 * @param paramMap
	 */
	private void dmSafeIdexGrid(EgovMap paramMap) {
		try {

			for (int i = 0; i < 24; i++) {
				logger.info("dmSafeIdexGrid get time : " + i);
				paramMap.put("stdrTm", String.format("%02d", i));
				/*
				 * List<EgovMap> list = sossMapper.selectDmSafeIdexGrid(paramMap);
				 * logger.info("dmSafeIdexGrid soss " + i);
				 * 
				 * if(list != null && list.size() != 0) { for (int j=0 ; j<list.size();
				 * j+=10000) { if (j < (list.size() - 10000)) { paramMap.put("list",
				 * list.subList(j, j+10000)); } else { paramMap.put("list", list.subList(j,
				 * list.size())); } srvcMapper.insertDmSafeIdexGrid(paramMap); }
				 * logger.info("dmSafeIdexGrid put mysql " + i + " : " + list.size()); }
				 */
			}

		} catch (Exception e) {
			isOk = false;
			e.printStackTrace();
			// batchFailInfo("DM_SAFE_IDEX_GRID", paramMap, e.getMessage());
			logger.error("dmSafeIdexGrid ERROR ~~!!");
		}
		// makeDangerContinuedTime(paramMap);
	}

	/*
	 * private void makeDangerContinuedTime(EgovMap paramMap) {
	 * logger.info("makeDangerContinuedTime start"); try { Map<String, Object>
	 * params = new HashMap<>(); params.put("userSeq", systemUser); EgovMap idex =
	 * mainService.selectsetting(params); paramMap.put("idex", idex);
	 * 
	 * logger.info("makeDangerContinuedTime params : " + paramMap.get("today") +
	 * " / " + paramMap.get("stdrDe") + " / " + idex.get("safeStep5"));
	 * srvcMapper.insertDangerContinuedTime(paramMap);
	 * 
	 * paramMap.put("colums", "GU_CD, ADMD_CD"); List<EgovMap> dongList =
	 * srvcMapper.selectDangerContinuedTime(paramMap);
	 * 
	 * String id = ""; int riskyTime = (int)idex.get("riskyTime"); int gridCnt = 0;
	 * int startTime = -1; int continuedTime = 0; ArrayList<String> arr = new
	 * ArrayList<>(); EgovMap map = null; for(EgovMap info : dongList) { String cds
	 * = info.get("guCd") + "|" + info.get("admdCd"); int stdrTm =
	 * Integer.parseInt(info.get("stdrTm").toString()); if(startTime == -1 ||
	 * "".equals(id)) { startTime = stdrTm; id = cds; continuedTime = 1; }else {
	 * if((startTime + continuedTime) == stdrTm && id.equals(cds)) {
	 * continuedTime++; String gridIds[] = info.get("gridId").toString().split(",");
	 * for(String gridId : gridIds) { if(!arr.contains(gridId)) { arr.add(gridId); }
	 * } }else { if(continuedTime >= riskyTime) { map.put("startTm", startTime);
	 * map.put("ctnuTm", continuedTime); map.put("gridCnt", arr.size()); arr = new
	 * ArrayList<>(); srvcMapper.insertDangerContinuedArea(map); } startTime =
	 * stdrTm; id = cds; continuedTime = 1; } } map = info; } }catch(Exception e) {
	 * e.printStackTrace(); } logger.info("makeDangerContinuedTime end"); }
	 *//**
		 * 안전지수행정동
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmSafeIdexAdmd(EgovMap paramMap) { try {
	 * logger.info("dmSafeIdexAdmd get hive"); List<EgovMap> list =
	 * sossMapper.selectDmSafeIdexAdmd(paramMap);
	 * 
	 * logger.info("dmSafeIdexAdmd size : " + list.size()); if(list != null &&
	 * list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmSafeIdexAdmd(paramMap); }
	 * logger.info("dmSafeIdexAdmd put mysql"); }catch(Exception e) { isOk = false;
	 * e.printStackTrace(); //batchFailInfo("DM_SAFE_IDEX_ADMD", paramMap,
	 * e.getMessage()); logger.error("dmSafeIdexAdmd ERROR ~~!!"); } }
	 *//**
		 * 안전지수시군구
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmSafeIdexSgg(EgovMap paramMap) { try {
	 * logger.info("dmSafeIdexSgg get hive"); List<EgovMap> list =
	 * sossMapper.selectDmSafeIdexSgg(paramMap);
	 * 
	 * logger.info("dmSafeIdexSgg size : " + list.size()); if(list != null &&
	 * list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmSafeIdexSgg(paramMap); }
	 * logger.info("dmSafeIdexSgg put mysql"); }catch(Exception e) { isOk = false;
	 * e.printStackTrace(); //batchFailInfo("DM_SAFE_IDEX_SGG", paramMap,
	 * e.getMessage()); logger.error("dmSafeIdexSgg ERROR ~~!!"); } }
	 *//**
		 * 순찰거점
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmPtrPst(EgovMap paramMap) { try {
	 * logger.info("dmPtrPst get hive"); List<EgovMap> list =
	 * sossMapper.selectDmPtrPst(paramMap);
	 * 
	 * logger.info("dmPtrPst size : " + list.size()); if(list != null && list.size()
	 * != 0) { paramMap.put("list", list); srvcMapper.insertDmPtrPst(paramMap); }
	 * logger.info("dmPtrPst put mysql"); }catch(Exception e) { e.printStackTrace();
	 * isOk = false; //batchFailInfo("DM_PTR_PST", paramMap, e.getMessage());
	 * logger.error("dmPtrPst ERROR ~~!!"); } }
	 *//**
		 * CCTV효율지수그리드
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmCctvEffIdexGrid(EgovMap paramMap) { try { for(int i=0 ; i<24 ;
	 * i++) { logger.info("dmCctvEffIdexGrid get hive : " + i);
	 * paramMap.put("stdrTm", String.format("%02d", i)); List<EgovMap> list =
	 * sossMapper.selectDmCctvEffIdexGrid(paramMap);
	 * 
	 * logger.info("dmCctvEffIdexGrid size : " + list.size()); if(list != null &&
	 * list.size() != 0) { for (int j=0 ; j<list.size(); j+=10000) { if (j <
	 * (list.size() - 10000)) { paramMap.put("list", list.subList(j, j+10000)); }
	 * else { paramMap.put("list", list.subList(j, list.size())); }
	 * srvcMapper.insertDmCctvEffIdexGrid(paramMap); } }
	 * logger.info("dmCctvEffIdexGrid put mysql : " + i + " / " + list.size()); }
	 * }catch(Exception e) { isOk = false; e.printStackTrace();
	 * logger.error("dmCctvEffIdexGrid ERROR ~~!!");
	 * //batchFailInfo("DM_CCTV_EFF_IDEX_GRID", paramMap, e.getMessage()); } }
	 *//**
		 * CCTV효율지수행정동
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmCctvEffIdexAdmd(EgovMap paramMap) { try {
	 * logger.info("dmCctvEffIdexAdmd get hive"); List<EgovMap> list =
	 * sossMapper.selectDmCctvEffIdexAdmd(paramMap);
	 * 
	 * logger.info("dmCctvEffIdexAdmd size : " + list.size()); if(list != null &&
	 * list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmCctvEffIdexAdmd(paramMap); }
	 * logger.info("dmCctvEffIdexAdmd put mysql"); }catch(Exception e) { isOk =
	 * false; e.printStackTrace(); logger.error("dmCctvEffIdexAdmd ERROR ~~!!");
	 * //batchFailInfo("DM_CCTV_EFF_IDEX_GRID", paramMap, e.getMessage()); } }
	 *//**
		 * CCTV효율지수시군구
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmCctvEffIdexSgg(EgovMap paramMap) { try {
	 * logger.info("dmCctvEffIdexSgg get hive"); List<EgovMap> list =
	 * sossMapper.selectDmCctvEffIdexSgg(paramMap);
	 * 
	 * logger.info("dmCctvEffIdexSgg size : " + list.size()); if(list != null &&
	 * list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmCctvEffIdexSgg(paramMap); }
	 * logger.info("dmCctvEffIdexSgg put mysql"); }catch(Exception e) { isOk =
	 * false; e.printStackTrace(); logger.error("dmCctvEffIdexSgg ERROR ~~!!");
	 * //batchFailInfo("DM_CCTV_EFF_IDEX_SGG", paramMap, e.getMessage()); } }
	 *//**
		 * 대구CCTV모니터비율
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmDgCctvMntrRate(EgovMap paramMap) { try { List<EgovMap> list =
	 * sossMapper.selectDmDgCctvMntrRate(paramMap);
	 * 
	 * if(list != null && list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmDgCctvMntrRate(paramMap); } }catch(Exception e) {
	 * e.printStackTrace(); isOk = false;
	 * logger.error("dmDgCctvMntrRate ERROR ~~!!");
	 * //batchFailInfo("DM_DG_CCTV_MNTR_RATE", paramMap, e.getMessage()); } }
	 *//**
		 * 대구CCTV모니터시간
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmDgCctvMntrTm(EgovMap paramMap) { try { List<EgovMap> list =
	 * sossMapper.selectDmDgCctvMntrTm(paramMap);
	 * 
	 * if(list != null && list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmDgCctvMntrTm(paramMap); } }catch(Exception e) {
	 * e.printStackTrace(); isOk = false; logger.error("dmDgCctvMntrTm ERROR ~~!!");
	 * //batchFailInfo("DM_DG_CCTV_MNTR_TM", paramMap, e.getMessage()); } }
	 *//**
		 * 구별CCTV모니터비율
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmGuCctvMntrRate(EgovMap paramMap) { try {
	 * logger.info("dmGuCctvMntrRate get hive"); List<EgovMap> list =
	 * sossMapper.selectDmGuCctvMntrRate(paramMap);
	 * 
	 * logger.info("dmGuCctvMntrRate size : " + list.size()); if(list != null &&
	 * list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmGuCctvMntrRate(paramMap); }
	 * logger.info("dmGuCctvMntrRate put mysql"); }catch(Exception e) {
	 * e.printStackTrace(); isOk = false;
	 * logger.error("dmGuCctvMntrRate ERROR ~~!!");
	 * //batchFailInfo("DM_GU_CCTV_MNTR_RATE", paramMap, e.getMessage()); } }
	 *//**
		 * 구별CCTV모니터시간
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmGuCctvMntrTm(EgovMap paramMap) { try {
	 * logger.info("dmGuCctvMntrTm get hive"); List<EgovMap> list =
	 * sossMapper.selectDmGuCctvMntrTm(paramMap);
	 * 
	 * logger.info("dmGuCctvMntrTm size : " + list.size()); if(list != null &&
	 * list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmGuCctvMntrTm(paramMap); }
	 * logger.info("dmGuCctvMntrTm put mysql"); }catch(Exception e) {
	 * e.printStackTrace(); isOk = false; logger.error("dmGuCctvMntrTm ERROR ~~!!");
	 * //batchFailInfo("DM_GU_CCTV_MNTR_TM", paramMap, e.getMessage()); } }
	 *//**
		 * 행정동별CCTV모니터비율
		 * 
		 * @param paramMap
		 */
	/*
	 * private void dmAdmdCctvMntrRate(EgovMap paramMap) { try { List<EgovMap> list
	 * = sossMapper.selectDmAdmdCctvMntrRate(paramMap);
	 * 
	 * if(list != null && list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmAdmdCctvMntrRate(paramMap); } }catch(Exception e) {
	 * e.printStackTrace(); isOk = false;
	 * logger.error("dmAdmdCctvMntrRate ERROR ~~!!");
	 * //batchFailInfo("DM_ADMD_CCTV_MNTR_RATE", paramMap, e.getMessage()); } }
	 * private void dmNpaDcrRcpStt(EgovMap paramMap) { try {
	 * logger.info("dmNpaDcrRcpStt get hive"); List<EgovMap> list =
	 * sossMapper.selectDmNpaDcrRcpStt(paramMap);
	 * 
	 * logger.info("dmNpaDcrRcpStt size : " + list.size()); if(list != null &&
	 * list.size() != 0) { paramMap.put("list", list);
	 * srvcMapper.insertDmNpaDcrRcpStt(paramMap); }
	 * logger.info("dmNpaDcrRcpStt put mysql"); }catch(Exception e) { isOk = false;
	 * e.printStackTrace(); logger.error("dmNpaDcrRcpStt ERROR ~~!!");
	 * //batchFailInfo("DM_NPA_DCR_RCP_STT", paramMap, e.getMessage()); } }
	 *//**
		 * 관제CCTV정보
		 * 
		 * @param paramMap
		 *//*
			 * private void cntCctvInfo(EgovMap paramMap) { try { List<EgovMap> list =
			 * sossMapper.selectCntCctvInfo(paramMap);
			 * 
			 * if(list != null && list.size() != 0) { paramMap.put("list", list);
			 * srvcMapper.deleteCntCctvInfo(paramMap);
			 * srvcMapper.insertCntCctvInfo(paramMap); } }catch(Exception e) { isOk = false;
			 * e.printStackTrace(); logger.error("cntCctvInfo ERROR ~~!!");
			 * logger.error(e.getMessage()); } }
			 * 
			 * @SuppressWarnings("unchecked") private void batchFailInfo(String tblNm,
			 * EgovMap params, String msg) { try { StringBuilder sb = new StringBuilder();
			 * params.forEach((key, value)-> sb.append(key + ":" + value + ","));
			 * 
			 * String query = sb.toString(); if(!"".equals(query)) { query =
			 * query.substring(0, query.length() - 1); }
			 * 
			 * EgovMap failInfo = new EgovMap(); failInfo.put("tblNm", tblNm);
			 * failInfo.put("query", query); failInfo.put("msg", msg);
			 * 
			 * srvcMapper.insertBatchFailInfo(failInfo); }catch(Exception e) {
			 * e.getStackTrace(); logger.error("batchFailInfo ERROR ~~!!"); } }
			 * 
			 * private void deleteBeforeData4Srvc(EgovMap paramMap) {
			 * logger.info("delete start SRVC data"); try {
			 * srvcMapper.deleteDmSafeIdexGrid(paramMap);
			 * srvcMapper.deleteDmCctvEffIdexGrid(paramMap);
			 * 
			 * srvcMapper.deleteDmSafeIdexAdmd(paramMap);
			 * srvcMapper.deleteDmSafeIdexSgg(paramMap);
			 * srvcMapper.deleteDmCctvEffIdexAdmd(paramMap);
			 * srvcMapper.deleteDmCctvEffIdexSgg(paramMap);
			 * srvcMapper.deleteDmGuCctvMntrRate(paramMap);
			 * srvcMapper.deleteDmGuCctvMntrTm(paramMap);
			 * srvcMapper.deleteLvlValIdexGrid(paramMap);
			 * 
			 * }catch(Exception e) { e.printStackTrace(); }
			 * logger.info("delete end SRVC data"); }
			 * 
			 * private boolean checkHiveConnection(EgovMap paramMap) {
			 * logger.info("check Hive Connection"); boolean result = true; try {
			 * sossMapper.testHive(paramMap); }catch(Exception e) { e.printStackTrace();
			 * logger.error("checkHiveConnection : hive connection Error : " +
			 * e.getMessage()); result = false; } logger.info("check Hive Connection : " +
			 * result); return result; }
			 * 
			 * private void makeStatsData(EgovMap paramMap) throws Exception { Map<String,
			 * Object> params = new HashMap<>();
			 * 
			 * // 안전지수 통계데이터를 생성한다. logger.info("makeDangerContinuedTime params : " +
			 * paramMap.get("today") + " / " + paramMap.get("stdrDe") + " / " +
			 * paramMap.get("userSeq")); logger.info("insertStatSafeData");
			 * 
			 * paramMap.put("tblName", "dm_safe_idex_grid"); List<String> admdList =
			 * srvcMapper.selectAdmdList(paramMap); for(String admd : admdList) { try {
			 * paramMap.put("admdCd", admd); srvcMapper.insertStatSafeData(paramMap);
			 * }catch(Exception e) { logger.error("makeStatsData : STAT_SAFE FAIL : " +
			 * admd); e.printStackTrace(); } }
			 * 
			 * // CCTV 호율 통계데이터를 생성한다. logger.info("insertStatCctvData");
			 * paramMap.put("tblName", "dm_cctv_eff_idex_grid"); admdList =
			 * srvcMapper.selectAdmdList(paramMap); for(String admd : admdList) { try {
			 * paramMap.put("admdCd", admd); srvcMapper.insertStatCctvData(paramMap);
			 * }catch(Exception e) { logger.error("makeStatsData : STAT_CCTV FAIL : " +
			 * admd); e.printStackTrace(); } }
			 * 
			 * // 알림 데이터를 생성한다. logger.info("insertAlarm"); try {
			 * srvcMapper.insertAlarm4SafeNormal(paramMap);
			 * srvcMapper.insertAlarm4CctvNormal(paramMap);
			 * 
			 * // 안전도 긴급알림 List<EgovMap> infoList =
			 * srvcMapper.selectAlarm4SafeEmergency(paramMap); for(EgovMap info : infoList)
			 * { String isOk = info.get("isOk").toString(); if("Y".equals(isOk)) {
			 * info.put("userSeq", paramMap.get("userSeq")); info.put("stdrDe",
			 * paramMap.get("today")); info.put("alTxt", info.get("areaNm") + " 지역 " +
			 * info.get("stdrTm") + " 평소대비 안전지수가 매우 낮아 집중검토 필요");
			 * srvcMapper.insertAlarm4Emergency(info); } }
			 * 
			 * // cctv 긴급알림 infoList = srvcMapper.selectAlarm4CctvEmergency(paramMap);
			 * String id = ""; int baseTm = 5; int startTime = -1; int continuedTime = 0;
			 * EgovMap almMap = null; for(EgovMap info : infoList) { String admdCd =
			 * info.get("areaCd").toString(); int stdrTm =
			 * Integer.parseInt(info.get("stdrTmNum").toString());
			 * 
			 * if(startTime == -1 || "".equals(id)) { startTime = stdrTm; id = admdCd;
			 * continuedTime = 1; }else { if((startTime + continuedTime) == stdrTm &&
			 * id.equals(admdCd)) { continuedTime++; }else { if(continuedTime >= baseTm) {
			 * almMap.put("userSeq", paramMap.get("userSeq")); almMap.put("stdrDe",
			 * paramMap.get("beforeDate")); almMap.put("cnt", continuedTime);
			 * almMap.put("alTxt", almMap.get("areaNm") + " 지역 " + startTime +
			 * ":00 CCTV 모니터 집중검토 " + baseTm + "시간 연속 발생 집중검토 필요");
			 * srvcMapper.insertAlarm4Emergency(almMap); } startTime = stdrTm; id = admdCd;
			 * continuedTime = 1; } } almMap = info; } if(continuedTime >= baseTm) {
			 * almMap.put("userSeq", paramMap.get("userSeq")); almMap.put("stdrDe",
			 * batchBeforeDate); almMap.put("cnt", continuedTime); almMap.put("alTxt",
			 * almMap.get("areaNm") + " 지역 " + startTime + ":00 CCTV 모니터 집중검토 " + baseTm +
			 * "시간 연속 발생 집중검토 필요"); srvcMapper.insertAlarm4Emergency(almMap); }
			 * }catch(Exception e) { logger.error("makeStatsData : AlARM INFO FAIL");
			 * e.printStackTrace(); }
			 * 
			 * // paramMap.put("stdrDe", "20191231"); //
			 * if((systemUser+"").equals(paramMap.get("userSeq"))) {
			 * logger.info("insertLvlIdexGrid"); try { // 공간격자레벨별지수를 계산한다. //
			 * DG_PCEL_LVL_MAP 의 데이터를 바탕으로 레벨별 그리드의 평균값을 계산한다. List<String> idList =
			 * srvcMapper.selectLvlMapGridIds(); for(String gridId : idList) {
			 * paramMap.put("gridId", gridId); srvcMapper.insertLvlIdexGrid(paramMap); }
			 * }catch(Exception e) { logger.error("makeStatsData : LVL_VAL_IDEX_GRID FAIL");
			 * e.printStackTrace(); } // } logger.info("makeStatsData end"); }
			 */

}
