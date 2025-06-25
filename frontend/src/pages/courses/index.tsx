import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import axiosInstance from "@/config/axios.config"
import { AppDispatch, RootState } from "@/store"
import { addToWishlist, fetchWishlist, removeFromWishlist } from "@/store/wishlist"
import { Filters, ICourse, IOptions, ISubcategoryOption } from "@/types/course.type"
import { ArrowUpDownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "sonner"
import { StudentsCourseCards } from "../../components/course/StudentsCourseCards"
import { buildFilterFromQueryParams, buildQueryParams } from "@/utils/query.utils"
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"
import { Input } from "@/components/ui/input"
import useDebounce from "@/components/hooks/useDebounce"
import { Pagination } from "@/components/ui/pagination"
import Loader from "@/components/ui/loader"
import { BorderBeam } from "@/components/magicui/border-beam"
import { filterOptions, sortOptions } from "@/config/helper.config"


const AllCourses = () => {

  const [couseCount, setCourseCount] = useState(0);
  const [totalPages, setTotalPages] = useState(2);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(() => Number(searchParams.get('page')) || 1);
  const limit = Number(searchParams.get('limit')) || 5;
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [sort, setSort] = useState(() => searchParams.get('sort') || 'price-lowtohigh');
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>(() => buildFilterFromQueryParams(searchParams));
  const { items: wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state: RootState) => state.wishlist
  );

  console.log(filters);



  const handleFilterOnChange = (
    sectionId: string,
    option: IOptions,
    isSubcategory = false
  ): void => {
    const copyFilters: Filters = { ...filters };

    if (!copyFilters[sectionId]) {
      copyFilters[sectionId] = isSubcategory
        ? [{ id: option.id, parentId: (option as ISubcategoryOption).parentId }]
        : [option.id];
    } else {
      if (isSubcategory) {
        const subcategoryList = copyFilters[sectionId] as ISubcategoryOption[];

        const index = subcategoryList.findIndex(
          (item) => item.id === option.id && item.parentId === (option as ISubcategoryOption).parentId
        );

        if (index === -1) {
          subcategoryList.push({
            id: option.id,
            parentId: (option as ISubcategoryOption).parentId,
          });
        } else {
          subcategoryList.splice(index, 1);
        }
      } else {
        const filterList = copyFilters[sectionId] as string[];
        const index = filterList.indexOf(option.id);

        if (index === -1) {
          filterList.push(option.id);
        } else {
          filterList.splice(index, 1);
        }
      }
    }
    setFilters(copyFilters);
    const search = buildQueryParams(copyFilters, searchQuery, sort);
    setCurrentPage(1);
    const newUrl = search ? `?${search}` : location.pathname;
    navigate(newUrl, { replace: true });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    const search = buildQueryParams(filters, e.target.value, sort);
    const newUrl = search ? `?${search}` : location.pathname;
    navigate(newUrl, { replace: true });
  }


  useEffect(() => {
    // Fetch all public courses
    const fetchCourses = async () => {
      setIsLoading(true);
      console.log('Filters:', filters, currentPage, limit);
      const query = buildQueryParams(filters, debouncedSearch, sort);
      try {
        const response = await axiosInstance.get<{ courses: ICourse[]; count: number }>(`/api/v1/courses?${query}&page=${currentPage}&limit=${limit}`);
        setCourses(response.data.courses);
        setCourseCount(response.data.count);
        setTotalPages(Math.ceil(response.data.count / limit));
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (error instanceof Error) {
          console.error('Failed to fetch courses:', error);
          toast.error(error.message);
        } else {
          console.error('Failed to fetch courses:', error);
          toast.error('Failed to fetch courses');
        }
      }
    };

    fetchCourses();
    dispatch(fetchWishlist());
  }, [dispatch, filters, debouncedSearch, sort, currentPage, limit]);


  const handleWishlistToggle = async (courseId: string, isInWishlist: boolean) => {
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(courseId)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(courseId)).unwrap();
        toast.success('Added to wishlist');
      }
      // Refresh wishlist after toggle
      void dispatch(fetchWishlist());
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update wishlist');
      }
    }
  };

  const totalLoading = wishlistLoading || isLoading;

  

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-3xl font-bold mb-4"> All Courses</h1>
      <div className="flex flex-col md:flex-row gap-4">

        <aside className="w-full md:w-64 space-y-4">

          <div className="p-4 space-y-4 backdrop-blur-3xl rounded-xl border border-sky-800/50">
            {
              (Object.keys(filterOptions) as (keyof typeof filterOptions)[]).map((keyItems) => (
                <div key={keyItems} className="space-y-4">
                  <h3 className="font-bold text-primary/70 mb-3">✧ {keyItems.toUpperCase()}</h3>
                  <div className="grid gap-2 mt-2">
                    {filterOptions[keyItems] &&
                      filterOptions[keyItems].map((option) => (
                        <div key={option.id}>
                          <Label key={option.id} className="flex items-center gap-2 cursor-pointer">
                            <Checkbox id={option.id} checked={filters[keyItems]?.some(item => item === option.id)} onCheckedChange={() => handleFilterOnChange(keyItems, option)} className="data-[state=checked]:bg-background data-[state=checked]:text-black dark:data-[state=checked]:text-sky-600 dark:data-[state=checked]:bg-sky-800/40 dark:data-[state]:border-sky-500/30" />
                            {option.label}
                          </Label>
                          <div className="mt-2 space-y-2">
                            {keyItems === "category" && 'subcategories' in option &&
                              option.subcategories?.map((subOption) => (
                                <Label key={subOption.id} className="flex items-center gap-2 cursor-pointer ml-6">
                                  <Checkbox
                                    id={subOption.id}
                                    checked={filters['subcategories']?.some(
                                      sub => (sub as ISubcategoryOption).id === subOption.id && (sub as ISubcategoryOption).parentId === option.id
                                    )}
                                    onCheckedChange={() => handleFilterOnChange('subcategories', { ...subOption, parentId: option.id }, true)}
                                    className="data-[state=checked]:bg-background data-[state=checked]:text-black dark:data-[state=checked]:text-rose-700 dark:data-[state=checked]:bg-rose-900/40 dark:data-[state]:border-rose-900/30"
                                  />
                                  {subOption.label}
                                </Label>
                              ))
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))
            }
            <div className="absolute inset-y-60 right-0 h-1/2 w-px bg-neutral-200/80 dark:bg-neutral-800/80">
              <div className="absolute inset-x-0 top-0 h-[360px] w-full bg-gradient-to-b from-transparent via-sky-800 to-transparent" />
            </div>
            <div className="absolute inset-x-3 top-0 h-6px w-1/2 bg-neutral-200/80 dark:bg-neutral-800/80">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-px w-20 bg-gradient-to-r from-transparent via-sky-800 to-transparent" />
            </div>
            <BorderBeam duration={8} size={100} />
            <BorderBeam initialOffset={100} duration={8} size={100} />
          </div>
        </aside>
        <main className="relative flex-1">
          <div className="flex justify-between items-center mb-8 gap-2">
            <div className="w-full max-w-sm">
              <Input
                type="search"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-sky-400/60 font-bold">{couseCount} - results</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size={"sm"} className="flex items-center gap-1">
                    <ArrowUpDownIcon className="h-3 w-3" />
                    <span className="font-semibold">Sort By</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={(value) => {
                      setSort(value);
                      const params = new URLSearchParams(searchParams);
                      if (value === 'price-lowtohigh') {
                        params.delete('sort');
                      } else {
                        params.set('sort', value);
                      }
                      navigate(`?${params.toString()}`, { replace: true });
                    }}>
                    {
                      sortOptions.map((option) => (
                        <DropdownMenuRadioItem key={option.id} value={option.id} className="capitalize">
                          {option.label}
                        </DropdownMenuRadioItem>
                      ))
                    }
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div>
            {totalLoading ? <div className="flex h-[300px] items-center justify-center"><Loader className="mr-2" /> Please Wait..</div>
            : <StudentsCourseCards isLoading={isLoading} courses={courses} wishlistItems={wishlistItems} handleWishlistToggle={handleWishlistToggle} />}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page)
                const params = new URLSearchParams(searchParams);
                params.set('page', page.toString());
                params.set('limit', limit.toString());
                navigate(`?${params.toString()}`, { replace: true });
              }}
              className="m-6 fixed bottom-0 right-0"
            />
          </div>
        </main>
      </div>

    </div>
  )
}

export default AllCourses