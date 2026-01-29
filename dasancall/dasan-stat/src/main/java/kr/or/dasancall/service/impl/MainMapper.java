package kr.or.dasancall.service.impl;

import java.util.HashMap;
import java.util.List;

import org.egovframe.rte.psl.dataaccess.mapper.Mapper;

import kr.or.dasancall.service.DashboardVO;

@Mapper("mainMapper")
public interface MainMapper {

	List<HashMap<String, Object>> selectDataList(DashboardVO vo) throws Exception;

}
