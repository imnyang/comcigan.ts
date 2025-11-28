import Comcigan from '../client'
import Fetcher from './Fetcher'
import type Region from './Region'
import type { Timetable } from './Timetable'

interface ISchool {
  /** 학교 코드 */
  code: number
  /** 학교 이름 */
  name: string
  /** 학교 지역 */
  region: Region
}

export default class School extends Fetcher implements ISchool {
  code: number
  name: string
  region: Region

  constructor(client: Comcigan, data: ISchool) {
    super(client)

    this.code = data.code
    this.name = data.name
    this.region = data.region
  }

  /** 이름으로 학교를 불러옵니다 */
  static async fromName(name: string, client?: Comcigan) {
    const cls = client ?? new Comcigan()
    const res = await cls.searchSchools(name)
    return res[0]
  }

  async getTimetable(nextWeek?: boolean): Promise<Timetable[][][][]>
  async getTimetable(
    grade: number,
    nextWeek?: boolean,
  ): Promise<Timetable[][][]>
  async getTimetable(
    grade: number,
    cls: number,
    nextWeek?: boolean,
  ): Promise<Timetable[][]>
  async getTimetable(
    grade: number,
    cls: number,
    day: number,
    nextWeek?: boolean,
  ): Promise<Timetable[]>
  async getTimetable(
    grade: number,
    cls: number,
    day: number,
    period: number,
    nextWeek?: boolean,
  ): Promise<Timetable>
  /** 시간표를 불러옵니다. */
  async getTimetable(
    gradeOrNextWeek?: number | boolean,
    clsOrNextWeek?: number | boolean,
    dayOrNextWeek?: number | boolean,
    periodOrNextWeek?: number | boolean,
    nextWeek = false,
  ) {
    // Parse arguments
    let grade: number | undefined
    let cls: number | undefined
    let day: number | undefined
    let period: number | undefined
    let isNextWeek = nextWeek

    if (typeof gradeOrNextWeek === 'boolean') {
      isNextWeek = gradeOrNextWeek
    } else {
      grade = gradeOrNextWeek
      if (typeof clsOrNextWeek === 'boolean') {
        isNextWeek = clsOrNextWeek
      } else {
        cls = clsOrNextWeek
        if (typeof dayOrNextWeek === 'boolean') {
          isNextWeek = dayOrNextWeek
        } else {
          day = dayOrNextWeek
          if (typeof periodOrNextWeek === 'boolean') {
            isNextWeek = periodOrNextWeek
          } else {
            period = periodOrNextWeek
          }
        }
      }
    }

    if (grade === undefined)
      return this.client.getTimetable(this.code, isNextWeek)
    if (cls === undefined)
      return this.client.getTimetable(this.code, grade, isNextWeek)
    if (day === undefined)
      return this.client.getTimetable(this.code, grade, cls, isNextWeek)
    if (period === undefined)
      return this.client.getTimetable(this.code, grade, cls, day, isNextWeek)
    return this.client.getTimetable(
      this.code,
      grade,
      cls,
      day,
      period,
      isNextWeek,
    )
  }
}
