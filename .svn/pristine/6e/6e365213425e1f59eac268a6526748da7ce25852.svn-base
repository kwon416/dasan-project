package kr.or.dasancall.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.egovframe.rte.psl.dataaccess.mapper.Mapper;
import org.egovframe.rte.psl.dataaccess.util.EgovMap;

import kr.or.dasancall.service.DashboardVO;

@Mapper("mainMapper")
public interface MainMapper {

	List<HashMap<String, Object>> selectDataList(DashboardVO vo) throws Exception;

	/** 대시보드 통합 쿼리 */
	List<EgovMap> selectDashboardAll(Map<String, Object> params) throws Exception;

}
