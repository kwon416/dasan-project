package egovframework.example.dasan.service;

import static org.junit.Assert.*;
import org.junit.Test;

/**
 * DataStatusVO 테스트
 */
public class DataStatusVOTest {

    @Test
    public void testAvgComplaintsPerDistrict_필드존재() {
        // Given
        DataStatusVO vo = new DataStatusVO();

        // When
        vo.setAvgComplaintsPerDistrict(12345);

        // Then
        assertEquals(12345, vo.getAvgComplaintsPerDistrict());
    }

    @Test
    public void testAvgComplaintsPerDistrict_계산검증() {
        // Given: totalRecords = 100000, totalDistricts = 25
        // Expected: avgComplaintsPerDistrict = 100000 / 25 = 4000
        DataStatusVO vo = new DataStatusVO();
        vo.setTotalRecords(100000);
        vo.setTotalDistricts(25);

        // When: 서비스에서 계산된 값 설정
        int expectedAvg = vo.getTotalRecords() / vo.getTotalDistricts();
        vo.setAvgComplaintsPerDistrict(expectedAvg);

        // Then
        assertEquals(4000, vo.getAvgComplaintsPerDistrict());
    }
}
